/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * A generic http error that can be safely converted into a client message.
 */
export class HttpError extends Error {

    /** The status code to serve this error with. */
    public statusCode: number = 500;

    /** The status message to serve this error with. Defaults to match the `statusCode`. */
    public statusMessage?: string;

    /** Extra data to be sent with this error. */
    public data?: {};

    /** The Error that caused this error. */
    public causedBy?: Error;

    constructor(...options: Array<number | string | Object | Error>) {
        super();
        options.forEach(o => {
            if(typeof o === 'number') this.statusCode = o;
            else if(typeof o === 'string') this.message = o;
            else if(o instanceof Error) this.causedBy = o;
            else this.data = o;
        })
    }

}
