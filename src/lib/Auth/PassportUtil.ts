/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Profile } from 'passport';
import { Sequelize } from 'sequelize-typescript';

import { UserSocialProfile } from '../../models/UserSocialProfile';
import { User } from '../../models/User';
import { Promise2Callback } from '../Util';
import { getOrCreateUser } from './DbUtil';

export type VerifyDone = (error: Error | null, user?: User) => void;
export type VerifyFunction = (token: string, tokenSecret: string, profile: Profile, onDone: VerifyDone) => void;
export type DeserializeDone = VerifyDone;
export type SerializeDone = (error: Error | null, userId?: number) => void;

/**
 * Checks that a profile is valid and throws if not.
 * @param passportProfile The profile data from passport.
 */
export function checkProfileData(passportProfile: Profile) {
    const { provider, id, username, displayName } = passportProfile;

    if (!provider) throw new Error("Social profile is missing a provider.");
    if (!id) throw new Error("Social profile is missing an Id.");
    if (!username) throw new Error("Social profile is missing a Username.");
    if (!displayName) throw new Error("Social profile is missing a Display Name.");
}

/**
 * Creates a new verify function.
 * @param sequelizeDb The Sequelize db to use.
 */
export function buildVerifyFunction(sequelizeDb: Sequelize): VerifyFunction {
    return (token: string, tokenSecret: string, profile: Profile, onDone: VerifyDone) => Promise2Callback<User>(
        getOrCreateUser(sequelizeDb, profile),
        onDone
    );
}

/**
 * Serializes a user.
 * @param user The user.
 * @param onDone A function to call once the user is serialized.
 */
export function serializeUser(user: User, onDone: SerializeDone) {
    onDone(null, user.id as number);
}

/**
 * Deserializes a user.
 * @param id The user's id.
 * @param onDone A function to call once the user is deserialized.
 */
export function deserializeUser(id: number, onDone: DeserializeDone) {
    Promise2Callback<User>(
        User.findById(id, { rejectOnEmpty: true, include: [UserSocialProfile] }) as PromiseLike<User> as Promise<User>,
        onDone
    ).catch();
}
