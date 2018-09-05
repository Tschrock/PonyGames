/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import * as path from 'path';

import { ISequelizeConfig } from 'sequelize-typescript';
import yargs = require('yargs');

export interface IConfig extends yargs.Arguments {
    db: ISequelizeConfig;
    web: {
        port: number;
        cookieSecret: string;
    };
}

/**
 * Does the config.
 */
export function doConfig(): IConfig {

    return yargs

        // Config file
        .config(
            (() => {
                try { return require(path.join(process.cwd(), 'config.json')); }
                catch(s) { return {}; }
            })() as {}
        )

        // Environment variables
        .env('CONFIG')

        // Command line options
        .options({
            'db.dialect': {
                choices: ['mysql', 'sqlite', 'postgres', 'mssql'],
                describe: "The type of backend database to use.",
                type: 'string'
            },
            'db.host': {
                describe: "The database host.",
                type: 'string'
            },
            'db.port': {
                describe: "The database port.",
                type: 'number'
            },
            'db.database': {
                describe: "The database name.",
                type: 'string'
            },
            'db.username': {
                describe: "The database username.",
                type: 'string'
            },
            'db.password': {
                describe: "The database password.",
                type: 'string'
            },
            'db.storage': {
                describe: "The path to the database file (sqlite only).",
                type: 'string'
            },
            'web.port': {
                describe: "The port to run the webserver on.",
                type: 'number',
                default: 8080
            },
            'web.cookieSecret': {
                describe: "The secret key for cookie storage.",
                type: 'string'
            },
        })

        // Enable help
        .help('help')
        .alias('h', 'help')

        // Enable version
        .version('version')
        .alias('v', 'version')

        // Parse and return
        .argv as IConfig;

}
