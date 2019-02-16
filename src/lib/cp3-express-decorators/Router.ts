/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Router as ExpressRouter, RequestHandler, ErrorRequestHandler, NextFunction } from 'express';

import { getMetadata, IHasMetadata } from './metadata';
import { ICanBeMiddleware, IAmMiddleware } from './IMiddleware';

interface IHasRouteHandlers {
    [key: string]: RequestHandler | ErrorRequestHandler;
}

/** The base class for a router. */
export class Router {

    /** Builds an express router for the class. */
    public static build() {
        const instance = new this();
        return instance.build();
    }

    /** Builds an express router for the class. */
    public build(prototype?: IHasMetadata): ExpressRouter {

        // If a prototype wasn't specified, use the one from `this`
        if (!prototype) prototype = Object.getPrototypeOf(this) as IHasMetadata;

        // Make a new router
        const router = ExpressRouter();

        // Get the metadata off the class prototype
        const metadata = getMetadata(prototype);

        // Add any before-router middleware
        for (const middleware of metadata.beforeMiddlewares) {
            router.use(normalizeMiddleware(middleware));
        }

        // Add all the route handlers
        for (const handlerMeta of metadata.routeHandlers.values()) {

            const target = this as this & IHasRouteHandlers;
            const method = target[handlerMeta.methodKey] as Function;

            var handlerFunction = method.bind(target);

            for (const routeMeta of handlerMeta.routes) {

                router[routeMeta.httpMethod](routeMeta.path, ...normalizeMiddlewares(handlerMeta.beforeMiddlewares), wrapHandler(handlerFunction), ...normalizeMiddlewares(handlerMeta.afterMiddlewares));

            }

        }

        // Recurse through the prototype chain and add inherited routers
        const proto = Object.getPrototypeOf(prototype);
        if (proto instanceof Router) {
            router.use(proto.build.call(this, proto as IHasMetadata));
        }

        // Add any after-router middleware
        for (const middleware of metadata.afterMiddlewares) {
            router.use(normalizeMiddleware(middleware));
        }

        // Return the router
        return router;
    }
}

function normalizeMiddlewares(middlewares: Array<ICanBeMiddleware>): Array<RequestHandler | ErrorRequestHandler> {
    return middlewares.map(normalizeMiddleware);
}

function isMiddlewareInstance(middleware: ICanBeMiddleware): middleware is IAmMiddleware {
    return "use" in middleware && typeof middleware.use === "function";
}

function normalizeMiddleware(middleware: ICanBeMiddleware): RequestHandler | ErrorRequestHandler {
    if(isMiddlewareInstance(middleware)) return (middleware.use as Function).bind(middleware);
    else return middleware;
}

function wrapHandler(handlerFunction: Function): RequestHandler | ErrorRequestHandler {
    if(handlerFunction.length <= 3) return ((req, res, next) => handleMaybePromise(handlerFunction(req, res, next), next)) as RequestHandler;
    else if(handlerFunction.length === 4) return ((err, req, res, next) => handleMaybePromise(handlerFunction(err, req, res, next), next)) as ErrorRequestHandler;
    else return  () => {};
}

function handleMaybePromise(maybePromise: any | Promise<any>, next: NextFunction) {
    if(typeof maybePromise !== "undefined" && "then" in maybePromise && "catch" in maybePromise) maybePromise.catch(next);
}
