/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export type RouteMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options' | 'all' | 'use';

/** Metadata for a Route. */
export class RouteMetadata {

    /** The HTTP method to respond to. */
    public httpMethod: RouteMethod;

    /** The path to respond to. */
    public path: string;

    constructor(httpMethod: RouteMethod, path: string) {
        this.httpMethod = httpMethod;
        this.path = path;
    }

}
