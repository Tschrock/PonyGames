/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import convict from 'convict';

export const Config = convict({
    env: {
        doc: "The application environment.",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV"
    },
    port: {
        doc: "The port to bind.",
        format: "port",
        default: 8080,
        env: "PORT",
        arg: "port"
    },
    cookieSecret: {
        doc: "The cookie secret.",
        format: "*",
        default: null as unknown as string,
        env: "COOKIE_SECRET",
        arg: "cookiesecret",
        sensitive: true
    },
    db: {
        doc: "The full uri for the database. For example: postgres://user:pass@example.com:5432/dbname",
        format: "*",
        default: "sqlite://localhost/ponygames.sqlite",
        env: "DB",
        arg: "db"
    },
    twitter: {
        consumerKey: {
            doc: "The Consumer Key for your app.",
            format: "*",
            default: "",
            env: "TWITTER_CLIENT_ID",
            arg: "clientid",
            sensitive: true
        },
        consumerSecret: {
            doc: "The Consumer Secret for your app.",
            format: "*",
            default: "",
            env: "TWITTER_CLIENT_SECRET",
            arg: "clientsecret",
            sensitive: true
        },
        callbackURL: {
            doc: "The callback url for your app. Should be https://<yourdomain>/auth/twitter/callback",
            format: "url",
            default: "http://localhost:8080/auth/twitter/callback",
            env: "TWITTER_CALLBACK_URL",
            arg: "callbackurl"
        }
    }
});

try {
    Config.loadFile("./config.json");
}
catch (error) {
    // Noop
}

Config.validate({ allowed: 'strict' });

export type Config = typeof Config;
