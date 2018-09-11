/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize } from 'sequelize-typescript';
import { Authenticator } from 'passport';

import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as GithubStrategy } from 'passport-github';

import { serializeUser, deserializeUser, buildVerifyFunction, getAuthOptions } from '../lib/Auth';
import { IConfig } from '../lib/Config';


/**
 * Sets up Passport for user logins.
 * @param options The global app options.
 * @param sequelizeDb The sequelize database to use for users.
 */
export function setupPassport(options: IConfig, sequelizeDb: Sequelize) {

    const passport = new Authenticator() as object as Authenticator;
    const verifyFunction = buildVerifyFunction(sequelizeDb);

    if (options.web.auth.twitter) {
        passport.use(new TwitterStrategy(
            getAuthOptions(options, 'twitter'),
            verifyFunction
        ));
    }

    if (options.web.auth.github) {
        passport.use(new GithubStrategy(
            getAuthOptions(options, 'github'),
            verifyFunction
        ));
    }

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    return passport;

}
