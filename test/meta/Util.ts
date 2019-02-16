/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { expect } from 'chai';

export interface ITestData {
    [key: string]: any;
}

export function checkPropertyValues(target: ITestData | null, checker: ITestData) {
    expect(target).does.exist;
    Object.keys(checker).forEach(k => expect(target).to.have.property(k, checker[k]));
}

export async function serializePromises<T, Q>(factory: (data: T) => Promise<Q> , dataArray: Array<T>) {
    let results: Array<Q> = [];
    for (const data of dataArray) {
        results.push(await factory(data));
    }
    return results;
}
