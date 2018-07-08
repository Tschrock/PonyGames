/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
'use strict';

// tslint:disable:prefer-function-over-method

import { Middleware, ExpressErrorMiddlewareInterface } from "routing-controllers";
import { Request, Response, NextFunction } from "express";

import { AnyError, HttpError, normalizeError } from "../../../lib/HttpError";

/** Json Error Handler */
@Middleware({ type: "after" })
export class JsonErrorHandler implements ExpressErrorMiddlewareInterface {

    /** on error */
    public error(error: AnyError, request: Request, response: Response, next: NextFunction) {
        const httpError: HttpError = normalizeError(error);
        response.status(httpError.statusCode).json(httpError.toResponseObject());
    }

}

