/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

interface ICookieAttributes {
    secure?: boolean;
    domain?: string;
    path?: string;
    httponly?: boolean;
    expires?: Date;
    maxage?: number;
}

/**
 * Sets a cookie. TODO: Actually make it do the thing.
 * @param key The key for the cookie.
 * @param value The value for the cookie.
 * @param attributes Extra attributes for the cookie.
 */
function setCookie(key: string, value: string, attributes?: ICookieAttributes) {
    attributes = attributes || {};

    if(!attributes.expires && attributes.maxage) {
        attributes.expires = new Date( Date.now() + attributes.maxage * 1000); // tslint:disable-line:no-magic-numbers
    }
}
