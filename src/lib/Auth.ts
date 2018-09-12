/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Profile, Strategy } from 'passport';
import { Sequelize } from 'sequelize-typescript';

import { UserSocialProfile } from '../models/UserSocialProfile';
import { User } from '../models/User';
import { ArrayLeftDiff, GetPsuedoRandomInt, Promise2Callback } from '../lib/Util';
import { IConfig } from './Config';

const USERNAME_DISCRIM_MAX_LEN = 9001;

/**
 * Gets or creates the user associated with a passport profile.
 * @param sequelizeDb The Sequelize db to use.
 * @param profile A person's Passport profile.
 */
export async function getOrCreateUser(sequelizeDb: Sequelize, profile: Profile): Promise<User> {
    const { provider, id, displayName, username } = profile;

    // Make sure we have the peices we need
    if (!provider) throw new Error("Social profile is missing a provider.");
    if (!id) throw new Error("Social profile is missing an Id.");
    if (!displayName) throw new Error("Social profile is missing a Display Name.");
    if (!username) throw new Error("Social profile is missing a Username.");

    console.log(`Seting up auth for ${provider} user: ${displayName} (@${username}) [${id}]`);

    // Start a new transaction
    return sequelizeDb.transaction(async transaction => {

        // Find or create the social profile
        const [socialProfile, wasCreated] = await UserSocialProfile.findOrCreate({
            transaction,
            limit: 1,
            where: { provider, externalId: id },
            defaults: { provider, externalId: id, displayName, username },
            include: [User],
        });

        // See if the social profile is connected to a user
        if (socialProfile.user) {

            // If so, return that user
            return socialProfile.user;
        }
        else {

            // Otherwise we need to create a new user, so see if their social profile's username is available
            const usernameOptions = [username, `${provider}-${username}`];
            const conflictingUsers = await User.findAll({
                where: Sequelize.or(
                    ...usernameOptions.map(un => ({ username: un }))
                ),
                transaction
            });

            // Get the closest available username
            const newUsername = ArrayLeftDiff(usernameOptions, conflictingUsers.map(u => u.username)).shift() || `${provider}-${username}-${GetPsuedoRandomInt(0, USERNAME_DISCRIM_MAX_LEN)}`;

            // Create a new user
            const newUser = await User.create(
                { username: newUsername, name: displayName, socialProfiles: [socialProfile] },
                { transaction }
            );

            await newUser.$add('socialProfiles', socialProfile.id, { transaction });

            return newUser;
        }
    });
}

type VerifyDone = (error: Error | null, user?: User) => void;
type DeserializeDone = VerifyDone;
type SerializeDone = (error: Error | null, userId?: number) => void;
type VerifyFunction = (token: string, tokenSecret: string, profile: Profile, onDone: VerifyDone) => void;

/**
 * Creates a new verify function.
 * @param sequelizeDb The Sequelize db to use.
 */
export function buildVerifyFunction(sequelizeDb: Sequelize): VerifyFunction {
    return (token, tokenSecret, profile: Profile, onDone: VerifyDone) => Promise2Callback<User>(
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

/**
 * Gets the auth options for a provider.
 * @param options The app's config options.
 * @param provider The auth provider to get options for.
 */
export function getAuthOptions<T>(options: IConfig, provider: string): T {
    const protocol = options.web.protocol === 'proxy' ? 'https' : options.web.protocol;
    return {
        ...options.web.auth[provider],
        callbackURL: `${protocol}://${options.web.domain}/auth/${provider}/callback`
    };
}
