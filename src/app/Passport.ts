/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize } from 'sequelize-typescript';
import { Authenticator, Strategy } from 'passport';


import { serializeUser, deserializeUser, buildVerifyFunction } from '../lib/Auth/PassportUtil';
import { IConfig, IWebConfig } from '../lib/IConfig';
import { OAuthManager } from '../lib/Auth/OAuthManager';

/**
 * Gets the root url for the configured webserver.
 * @param webconfig The webserver config.
 */
export function getWebsiteRootUrl(webconfig: IWebConfig) {
    return `https://${webconfig.domain}`
}

/**
 * Builds an oauth callback url.
 * @param provider The name of the oauth provider.
 */
export function buildCallbackUrl(provider: string) {
    return `/auth/${provider}/callback`
}

/**
 * Builds an oauth login url.
 * @param provider The name of the oauth provider.
 */
export function buildLoginUrl(provider: string) {
    return `/login/${provider}`
}


/**
 * Sets up Passport for user logins.
 * @param options The global app options.
 * @param sequelizeDb The sequelize database to use for users.
 */
export function setupPassport(options: IConfig, sequelizeDb: Sequelize) {

    // Create a new Pasport instance
    const passport = new Authenticator() as object as Authenticator;

    // Build a verify function that uses the given sequelizeDb as a backend
    const verifyFunction = buildVerifyFunction(sequelizeDb);

    // Get the web root for our callback urls
    const webRoot = getWebsiteRootUrl(options.web);

    // Load all configured providers
    const authMgr = new OAuthManager();
    const providers = authMgr.loadAll(options.oauth);
    
    // Build the strategy for each provider
    const strategies = providers.map(p => p.buildStrategy(
        webRoot + buildCallbackUrl(p.id),
        verifyFunction
    ));

    // Load the strategies into Passport
    strategies.forEach(s => passport.use(s));

    // Set up the user serializer
    passport.serializeUser(serializeUser);
    
    // Set up the user deserializer
    passport.deserializeUser(deserializeUser);

    return passport;

}
