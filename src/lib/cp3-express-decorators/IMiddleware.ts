/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RequestHandler, ErrorRequestHandler } from "express";

export interface IAmMiddleware {
    use: RequestHandler | ErrorRequestHandler;
}

export type ICanBeMiddleware = RequestHandler | ErrorRequestHandler | IAmMiddleware;

export interface IUseMiddleware {

    /**
     * Middleware to run before the router's routes.
     */
    readonly beforeMiddlewares: ICanBeMiddleware[];

    /**
     * Middleware to run after the router's routes.
     */
    readonly afterMiddlewares: ICanBeMiddleware[];
}
