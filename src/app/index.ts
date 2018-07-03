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
import { isDev, setupExpress } from './Express';

// Get the Config
const options = doConfig();

// Setup Components
const app = setupExpress();
setupSequelize(options, isDev(app));
setupHttp(options, app);

console.log('App started.');
