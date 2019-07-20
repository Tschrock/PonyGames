/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { App } from './App';
import { Config } from './Config';
import { Database } from './Database';


const projectsJson = require('../../projects.json'); // tslint:disable-line:no-var-requires

async function initServer() {

    const database = new Database(Config.get("db"));

    const app = new App(Config, database);

    await database.sync();
    await database.loadProjectsFromJson(projectsJson);

    // Start listening
    return new Promise((resolve, reject) => {

        app.app.listen(Config.get("port"), () => {
            console.log(`listening on port ${Config.get("port")}`);
            resolve();
        });

    });


}


initServer().then(() => { /* noop */ }, err => console.error(err));
