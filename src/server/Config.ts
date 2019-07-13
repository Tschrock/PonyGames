/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import convict from 'convict';

const config = convict({
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
        default: "postgres://ponygames@localhost:5432/ponygames",
        env: "DB",
        arg: "db"
    }
});

try {
    config.loadFile("./config.json");
}
catch (error) {
    // Noop
}

config.validate({ allowed: 'strict' });

export const Config = config;
