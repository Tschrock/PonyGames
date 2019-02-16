/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { join as joinPath } from 'path';
import { Sequelize } from 'sequelize-typescript';
import debugBuilder from 'debug';
import { loadTestData as ogLoadTestData } from '../../testData';

const debugDb = debugBuilder('test-db');

export const TestDB = new Sequelize({
    logging: debugDb,
    modelPaths: [joinPath(__dirname, '..', '..', 'src', 'models')],
    operatorsAliases: false,
    dialect: 'sqlite',
    database: 'test-db',
    username: 'root',
    password: '',
    storage: ':memory:'
});

export async function clearTestDB() {
    return TestDB.sync({ force: true });
}

export async function loadTestData() {
    return clearTestDB().then(ogLoadTestData);
}

clearTestDB();
