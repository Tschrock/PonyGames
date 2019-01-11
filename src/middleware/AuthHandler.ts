/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IAmMiddleware } from "../services/ExpressService";
import { RequestHandler } from 'express';
import { AuthService } from "../services";

export class AuthHandler implements IAmMiddleware {

    use: RequestHandler;

    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;

        this.use = this.authService.authenticator.session();

    }

}
