/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IAmMiddleware } from "../services/ExpressService";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "cp3-express-decorators";

/** General Error Handler */
export class HtmlErrorHandler implements IAmMiddleware {

    /** on error */
    public use(error: Error, req: Request, res: Response, next: NextFunction) {

        const httpError = (error instanceof HttpError) ? error : new HttpError(500, error);

        res.status(httpError.statusCode);

        res.format({
            html: () => res.render('error', { httpError })
        });

    }

}

