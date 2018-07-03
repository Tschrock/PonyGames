/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import { IFindOptions } from "sequelize-typescript";

export interface IPagenateQuery {
    page?: number;
    perpage?: number;
}

export interface IPaginateConfig {
    defaultPageSize?: number;
    maxPageSize?: number;
    minPageSize?: number;
}

/**
 * Limits a value.
 * @param value The value.
 * @param min The minimum value.
 * @param max The maximum value.
 */
function limitBetween(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

/**
 * Attempts to coherse a value into a safe integer.
 * @param value The value.
 * @param defaultValue The default value;
 */
function tryInteger<T>(value: string | number | undefined, defaultValue: T) {
    if(typeof value === 'undefined') return defaultValue;
    const asNum = +value;
    return Number.isSafeInteger(asNum) ? asNum : defaultValue;
}

/**
 * Gets the appropriate Find() options for a given querystring.
 * @param queryOptions The query object.
 * @param config The config options.
 */
export function paginate<T>(query: IPagenateQuery, config?: IPaginateConfig): IFindOptions<T> {
    const options: IFindOptions<T> = {};

    const findConfig = {
        defaultPageSize: 50,
        maxPageSize: 100,
        minPageSize: 10,
        ...config
    };

    options.limit = limitBetween(tryInteger(query.perpage, 0), findConfig.minPageSize, findConfig.maxPageSize);

    if(typeof query.page === 'undefined') {
        // page is missing, use default
        options.offset = 0;
    }
    else {
        const pageInt = tryInteger(query.page, null);
        if(pageInt === null || pageInt < 1) {
            // page invalid/out of range, return empty page
            options.limit = options.offset = 0;
        }
        else {
            // set page offset
            options.offset = (pageInt - 1) * options.limit;
        }
    }

    return options;
}
