/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import yargs = require('yargs');

import { IDatabaseOptions } from '../services/DatabaseService';
import { IStrategyProviderOptions } from '../services/AuthService';


export interface IWebConfig {
    domain: string;
    port: number;
    cookieSecret: string;
}

export interface IConfig extends Partial<yargs.Arguments> {
    web: IWebConfig;
    db: IDatabaseOptions;
    oauth: IStrategyProviderOptions[];
}
