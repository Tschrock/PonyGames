#!/usr/bin/env node
/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { ExpressMiddlewareInterface, Middleware } from "routing-controllers";
import { Request, Response, NextFunction } from "express";

/**
 * Prevents Routes from falling through after being handled because
 * routing-controllers is silly and calls next() where it shouldn't.
 */
@Middleware({ type: "after" })
export class NoNext implements ExpressMiddlewareInterface {

    public use(request: Request, response: Response, next: NextFunction) {
        // Only fall through if we haven't sent anything yet
        if (!response.headersSent) {
            next();
        }
    }

}
