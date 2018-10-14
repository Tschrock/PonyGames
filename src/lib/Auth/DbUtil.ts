/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Profile } from 'passport';
import { Sequelize } from 'sequelize-typescript';
import { Transaction, UniqueConstraintError } from 'sequelize';

import { UserSocialProfile } from '../../models/UserSocialProfile';
import { User } from '../../models/User';
import { GetPsuedoRandomInt } from '../Util';
import { USERNAME_RANDOMIZER_MAX } from '../Constants';
import { checkProfileData } from './PassportUtil';


/**
 * Updates a user's Social Profile with the profile data from passport.
 * @param socialProfile The user's Social Profile.
 * @param passportProfile The profile data from passport.
 * @param dbTransaction The database transaction to use.
 */
export async function updateSocialProfile(socialProfile: UserSocialProfile, passportProfile: Profile, dbTransaction?: Transaction): Promise<UserSocialProfile> {
    const { username, displayName } = passportProfile;
    return socialProfile.update({ username, displayName }, { transaction: dbTransaction });
}

/**
 * Gets the matching social profile, or creates it if it doesn't exist.
 * @param passportProfile The profile provided by passport.
 * @param dbTransaction The database transaction to use.
 */
export async function getOrCreateSocialProfile(passportProfile: Profile, dbTransaction?: Transaction): Promise<[UserSocialProfile, boolean]> {
    const { provider, id, displayName, username } = passportProfile;
    return UserSocialProfile.findOrCreate({
        transaction: dbTransaction,
        limit: 1,
        where: { provider, externalId: id },
        defaults: { provider, username, displayName, externalId: id },
        include: [ User ],
    });
}

/**
 * Gets a social profile from the database, creating or updating it as needed.
 * @param passportProfile The profile provided by passport.
 * @param dbTransaction The database transaction to use.
 */
export async function getSocialProfile(passportProfile: Profile, dbTransaction?: Transaction): Promise<UserSocialProfile> {
    checkProfileData(passportProfile);

    const [socialProfile, wasCreated] = await getOrCreateSocialProfile(passportProfile, dbTransaction);

    if(wasCreated) return socialProfile;
    else return updateSocialProfile(socialProfile, passportProfile, dbTransaction);
}

/** The error returned when a username is already taken. */
export class UsernameTakenError extends Error {
    constructor() {
        super("Username already exists.");
    }
}

/**
 * Creates a new user based on the data from the given social profile,
 * @param socialProfile The user's Social Profile.
 * @param dbTransaction The database transaction to use.
 */
export async function createNewUser(socialProfile: UserSocialProfile, dbTransaction?: Transaction) {
    const { provider, username, displayName } = socialProfile;

    const usernameChoices = [
        username,
        `${provider}-${username}`,
        `${provider}-${username}-${GetPsuedoRandomInt(0, USERNAME_RANDOMIZER_MAX)}`
    ];

    for (const newUsername of usernameChoices) {
        try {
            return await User.create(
                { username: newUsername, name: displayName },
                { transaction: dbTransaction }
            );
        }
        catch(e) {
            if(!(e instanceof UniqueConstraintError)) throw e;
        }
    }

    throw new UsernameTakenError();
}

/**
 * Gets or creates the user associated with a passport profile.
 * @param sequelizeDb The Sequelize db to use.
 * @param profile A person's Passport profile.
 */
export async function getOrCreateUser(sequelizeDb: Sequelize, passportProfile: Profile): Promise<User> {

    // Start a new transaction
    return sequelizeDb.transaction(async transaction => {

        const socialProfile = await getSocialProfile(passportProfile, transaction);

        // See if the social profile is connected to a user
        if (socialProfile.user) return socialProfile.user;
        else {
            const newUser = await createNewUser(socialProfile, transaction);
            await newUser.$add('socialProfiles', socialProfile.id, { transaction });
            return newUser;
        }
    });
}
