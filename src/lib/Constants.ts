/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

'use strict';

/** If the current environment is a development environment */
export const isDev = process.env.NODE_ENV !== 'production';


/** The maximum length for a "short" string in the database. */
export const SHORT_STRING_MAX_LENGTH = 255;

/** The maximum length for a "medium" string in the database. */
export const MEDIUM_STRING_MAX_LENGTH = 1024;

/** The maximum length for a "long" string in the database. */
export const LONG_STRING_MAX_LENGTH = 4096;


/** The maximum length for an entity's name in the database. */
export const ENTITY_NAME_MAX_LENGTH = SHORT_STRING_MAX_LENGTH;

/** The maximum length for an entity's short description in the database. */
export const ENTITY_SHORT_DESCRIPTION_MAX_LENGTH = SHORT_STRING_MAX_LENGTH;


/**
 * The number of random bytes to use when generating a secret cookie key.
 *
 * **The key should already be set in the app's config, but if it isn't we will generate our own.**
 */
export const DEFAULT_COOKIE_SECRET_RANDOM_BYTES = 20;

/** The maximum number to append to a username when trying to generate one that's still available. */
export const USERNAME_RANDOMIZER_MAX = 9999;
