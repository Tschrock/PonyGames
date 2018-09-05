#!/usr/bin/env node
/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { doConfig } from '../lib/Config';
import { setupHttp } from './Http';
import { setupSequelize } from './Sequelize';
import { setupExpress } from './Express';
import { isDev } from '../lib/Constants';

// Get the Config
const options = doConfig();

// Setup Components
const sequelizeDb = setupSequelize(options, isDev);
const expressApp =  setupExpress(options, sequelizeDb);
const httpServer =  setupHttp(options, expressApp);

console.log('App started.');
