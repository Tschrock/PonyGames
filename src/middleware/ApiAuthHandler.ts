/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IAmMiddleware } from "cp3-express-decorators";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthService } from '../services';

export class ApiAuthHandler implements IAmMiddleware {

    public use: RequestHandler;
    private authService: AuthService;
    private authFromSession: RequestHandler;

    constructor(authService: AuthService) {
        this.authService = authService;
        this.authFromSession = this.authService.authenticator.session();
        this.use = this._use.bind(this);
    }

    private _use(req: Request, res: Response, next: NextFunction) {

        // Try authing from the session
        this.authFromSession(req, res, next);

        // If successfull, check the Csrf token
        if(!req.user) (req as any).skipCsrf = true;
        
        // TODO: API Keys

    }

}
