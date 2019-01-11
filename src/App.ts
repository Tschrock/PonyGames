/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IConfig } from "./lib/IConfig";
import { AuthService, DatabaseService, ExpressService, HttpService } from "./services";

export class App {

    constructor(config: IConfig) {
        const dbService = new DatabaseService(config.db);
        const authService = new AuthService({ providers: config.oauth }, dbService.database);
        const expressService = new ExpressService(config, dbService.database, authService);
        const httpService = new HttpService(config.web.port, expressService.app);
    }

}
