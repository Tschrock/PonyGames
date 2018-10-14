/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { ISequelizeConfig } from 'sequelize-typescript';
import yargs = require('yargs');

import { IOauthConfig } from './Auth/OAuthManager';


export interface IWebConfig {
    domain: string;
    port: number;
    cookieSecret: string;
}

export interface IConfig extends Partial<yargs.Arguments> {
    db: ISequelizeConfig;
    web: IWebConfig;
    oauth: IOauthConfig[];
}
