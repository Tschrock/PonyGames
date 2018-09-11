/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

'use strict';

export const isDev = process.env.NODE_ENV !== 'production';

export const SHORT_STRING_MAX_LENGTH = 255;
export const MEDIUM_STRING_MAX_LENGTH = 1024;
export const LONG_STRING_MAX_LENGTH = 4096;

export const ENTITY_NAME_MAX_LENGTH = SHORT_STRING_MAX_LENGTH;
export const ENTITY_SHORT_DESCRIPTION_MAX_LENGTH = SHORT_STRING_MAX_LENGTH;

export const DEFAULT_COOKIE_SECRET_RANDOM_BYTES = 20;
