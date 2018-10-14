/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import * as debugBuilder from 'debug';
import { Sequelize } from 'sequelize-typescript';

import { modelsRoot } from "./Express";
import { IConfig } from '../lib/IConfig';

(Sequelize.Promise as {}) = global.Promise;

/**
 * Setup Sequelize
 */
export function setupSequelize(options: IConfig) {

    // Setup debug
    const debugDb = debugBuilder('db');

    const sequelize = new Sequelize({
        // Basic Config
        logging: debugDb,
        modelPaths: [modelsRoot],
        operatorsAliases: false,

        // Default DB
        database: 'website',
        dialect: 'sqlite',
        username: 'root',
        password: '',
        storage: ':memory:',

        // User Config
        ...options.db
    });
    
    sequelize.sync();

    return sequelize;
}
