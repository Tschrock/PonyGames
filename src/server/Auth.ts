/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Profile } from 'passport';

import { UserAccount } from './models';

/**
 * Waits for a promise and then calls the specified callback.
 * @param promise The promise.
 * @param callback The callback.
 */
export function promise2Callback<T, Q = void>(promise: PromiseLike<T>, callback: (err: Error | null, rtn?: T) => Q) {
    promise
        .then(result => callback(null, result))
        .then(() => { /* noop */}, (error: Error) => callback(error, void 0));
}

function rejectNull<T>(thing: T | null, message: string) {
    if (thing === null) throw new Error(message);
    return thing;
}

export async function getNewOrUpdatedAccount(auth_token: string, refresh_token: string, profile: Profile): Promise<UserAccount> {
    return UserAccount.upsert({
        external_id: profile.id,
        name: profile.displayName,
        email: profile.emails && profile.emails.length > 0 ? profile.emails[0] : "",
        auth_token,
        refresh_token
    })
        .then(_ => UserAccount.findOne({ where: { external_id: profile.id } }))
        .then(account => rejectNull(account, "Could not find account."));
}

export type VerifyDone = (error: Error | null, user?: UserAccount) => void;
export type VerifyFunction = (token: string, tokenSecret: string, profile: Profile, onDone: VerifyDone) => void;
export type DeserializeDone = VerifyDone;
export type SerializeDone = (error: Error | null, userId?: number) => void;

/**
 * Verifies and returns a User.
 */
export function verifyUser(accessToken: string, refreshToken: string, profile: Profile, onDone: VerifyDone) {
    promise2Callback<UserAccount>(
        getNewOrUpdatedAccount(accessToken, refreshToken, profile),
        onDone
    );
}

/**
 * Serializes a user.
 * @param user The user.
 * @param onDone A function to call once the user is serialized.
 */
export function serializeUser(user: UserAccount, onDone: SerializeDone) {
    onDone(null, user.id);
}

/**
 * Deserializes a user.
 * @param id The user's id.
 * @param onDone A function to call once the user is deserialized.
 */
export function deserializeUser(id: number, onDone: DeserializeDone) {
    promise2Callback<UserAccount>(
        UserAccount.findByPk(id, { rejectOnEmpty: true }),
        onDone
    );
}
