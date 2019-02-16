/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Request, Response, NextFunction } from "express";
import { Router, Get } from "../lib/cp3-express-decorators";

import { AuthService } from '../services/AuthService';

/** The Auth Controller */
export class AuthController extends Router {
    
    constructor(private authService: AuthService) {
        super();
    }

    @Get("/:provider")
    public getProvider(req: Request, res: Response, next: NextFunction) {

        return this.authService.authenticator.authenticate(req.params["provider"])(req, res, next);

    }

    @Get("/:provider/callback")
    public getProviderCallback(req: Request, res: Response, next: NextFunction) {

        return this.authService.authenticator.authenticate(req.params["provider"], { successRedirect: '/', failureRedirect: '/login' })(req, res, next);

    }

}
