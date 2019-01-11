/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IAmMiddleware } from "../services/ExpressService";
import { RequestHandler } from 'express';
import { Sequelize } from 'sequelize-typescript';

import processSessions from "express-session";

import createSequelizeStore = require("connect-session-sequelize");
const tSequelizeStore = createSequelizeStore(processSessions.Store);

export class SessionHandler implements IAmMiddleware {

    use: RequestHandler;

    constructor(secret: string, db: Sequelize) {
        this.use = processSessions({
            cookie: {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
            },
            secret: secret,
            store: new tSequelizeStore({ db }),
            resave: false,
            proxy: true,
            saveUninitialized: true,
        });
    }

}
