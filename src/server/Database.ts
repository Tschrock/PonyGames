/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Sequelize } from 'sequelize-typescript';

import * as Models from './models';

export class Database {

    public readonly sequelize: Sequelize;

    constructor(connectionUri: string) {

        this.sequelize = new Sequelize(connectionUri, {
            models: Object.values(Models)
        });

    }

    public async sync() {
        return this.sequelize.sync();
    }

    public async authenticate() {
        return this.sequelize.authenticate();
    }

    public async loadProjectsFromJson(projectsJson: any) {

        for(const projectJson of projectsJson) {
            await Models.Project.create(projectJson, { include: [ Models.Image, Models.Link ] });
        }

        return Models.Project.findAll({ include: [ Models.Image, Models.Link ] });

    }

}
