/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import path from 'path';

import { Sequelize } from 'sequelize-typescript';

export class Database {

    public readonly sequelize: Sequelize;

    constructor(connectionUri: string) {

        this.sequelize = new Sequelize(connectionUri, {
            modelPaths: [path.join(__dirname, "models")]
        });

    }

    public async sync() {
        return this.sequelize.sync();
    }

    public async authenticate() {
        return this.sequelize.authenticate();
    }

}
