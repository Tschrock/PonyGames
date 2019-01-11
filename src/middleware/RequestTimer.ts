/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { IAmMiddleware } from "../services/ExpressService";
import { RequestHandler } from 'express';

import { timeRequest } from '../lib/RequestTimer';

export class RequestTimer implements IAmMiddleware {

    use: RequestHandler;

    constructor() {
        this.use = timeRequest;
    }

}
