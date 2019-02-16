/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RouteMetadata } from "./RouteMetadata";
import { ICanBeMiddleware, IUseMiddleware } from "../IMiddleware";

/**
 * Metadata for a route handler.
 */
export class RouteHandlerMetadata implements IUseMiddleware {

    /**
     * The key of the function this metadata is for.
     */
    public methodKey: string;

    /**
     * The routes this handler should respond to.
     */
    public routes: RouteMetadata[] = [];

    /**
     * Middleware to run before the route.
     */
    public readonly beforeMiddlewares: ICanBeMiddleware[] = [];

    /**
     * Middleware to run after the route.
     */
    public readonly afterMiddlewares: ICanBeMiddleware[] = [];

    constructor(methodKey: string) {
        this.methodKey = methodKey;
    }

}
