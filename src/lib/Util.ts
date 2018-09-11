/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/**
 * Returns a psuedo-random integer between min and max.
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param min The minimum integer (inclusive).
 * @param max The maximum integer (inclusive).
 */
export function GetPsuedoRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns all elements in the left array that aren't in the right array.
 * Source: https://stackoverflow.com/a/33034768
 * @param leftArr The left array.
 * @param rightArr The right array.
 */
export function ArrayLeftDiff<T>(leftArr: Array<T>, rightArr: Array<T>): Array<T> {
    return leftArr.filter(x => !rightArr.includes(x));
}

/**
 * Returns all elements that are in both arrays.
 * Source: https://stackoverflow.com/a/33034768
 * @param leftArr The left array.
 * @param rightArr The right array.
 */
export function ArrayIntersect<T>(leftArr: Array<T>, rightArr: Array<T>): Array<T> {
    return leftArr.filter(x => rightArr.includes(x));
}

/**
 * Returns all elements that are not in both arrays.
 * Source: https://stackoverflow.com/a/33034768
 * @param leftArr The left array.
 * @param rightArr The right array.
 */
export function ArraySymetricDiff<T>(leftArr: Array<T>, rightArr: Array<T>): Array<T> {
    return [...ArrayLeftDiff(leftArr, rightArr), ...ArrayLeftDiff(rightArr, leftArr)];
}

/**
 * Waits for a promise and then calls the specified callback.
 * @param promise The promise.
 * @param callback The callback.
 */
export function Promise2Callback<T, Q = void>(promise: PromiseLike<T>, callback: (err: Error | null, rtn?: T) => Q) {
    promise.then(
        result => callback(null, result),
        error => callback(error, void 0)
    )
}
