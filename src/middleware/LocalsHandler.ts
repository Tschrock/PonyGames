/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IAmMiddleware } from "cp3-express-decorators";
import { Request, Response, NextFunction, RequestHandler } from "express";

export class LocalsHandler implements IAmMiddleware {

    public use(req: Request, res: Response, next: NextFunction) {

        res.locals["CurrentUser"] = req.user;

        next();

    }

}
