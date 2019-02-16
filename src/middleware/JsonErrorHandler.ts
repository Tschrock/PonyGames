/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IAmMiddleware } from "../services/ExpressService";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../lib/cp3-express-decorators";

/** Json Error Handler */
export class JsonErrorHandler implements IAmMiddleware {

    /** on error */
    public use(error: Error, request: Request, response: Response, next: NextFunction) {

        var httpError: HttpError;
        if(error instanceof HttpError) {
            httpError = error;
        }
        else {
            httpError = new HttpError(500, error);
        }

        response.status(httpError.statusCode).json([httpError, httpError.causedBy ? httpError.causedBy.stack: null]);
    }

}

