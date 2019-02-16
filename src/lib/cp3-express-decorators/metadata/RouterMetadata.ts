/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RouteHandlerMetadata } from "./RouteHandlerMetadata";
import { RouteMetadata } from "./RouteMetadata";

import { ICanBeMiddleware, IUseMiddleware } from "../IMiddleware";

export const METADATA_TAG = "__cp3ed_router__";

/**
 * Metadata for a router.
 */
export class RouterMetadata implements IUseMiddleware {

    // Properties

    /**
     * The route handlers this router has.
     */
    public readonly routeHandlers = new Map<string, RouteHandlerMetadata>();

    /**
     * Middleware to run before the router's routes.
     */
    public readonly beforeMiddlewares: ICanBeMiddleware[] = [];

    /**
     * Middleware to run after the router's routes.
     */
    public readonly afterMiddlewares: ICanBeMiddleware[] = [];

    // Methods

    /**
     * Gets a route handler by it's method key.
     * @param methodKey The method key.
     */
    public getHandler(methodKey: string) {
        let handler = this.routeHandlers.get(methodKey);
        if (!handler) {
            handler = new RouteHandlerMetadata(methodKey);
            this.routeHandlers.set(methodKey, handler);
        }
        return handler;
    }

    /**
     * Adds a route to a route handler.
     * @param methodKey THe method key.
     * @param route The route metadata.
     */
    public addRoute(methodKey: string, route: RouteMetadata) {
        this.getHandler(methodKey).routes.push(route);
    }
}


/**
 * An object with metadata.
 */
export interface IHasMetadata {

    /**
     * The router metadata
     */
    [METADATA_TAG]?: RouterMetadata;

}

/**
 * Gets the router metadata associated with the given object.
 * @param target The object to get metadata for.
 */
export function getMetadata(target: Object & IHasMetadata): RouterMetadata {
    const hasOwnMetadata = target.hasOwnProperty(METADATA_TAG);

    if(!hasOwnMetadata) return target[METADATA_TAG] = new RouterMetadata();
    else return target[METADATA_TAG]!; // tslint:disable-line: no-non-null-assertion
}
