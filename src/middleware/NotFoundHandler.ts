/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IAmMiddleware } from "../services/ExpressService";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "cp3-express-decorators";

export class NotFoundHandler implements IAmMiddleware {

    public use(req: Request, res: Response, next: NextFunction) {

        next(new HttpError(404, "Page not found."));

    }

}

