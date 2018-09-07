/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Authenticator } from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Sequelize } from 'sequelize';

import { IConfig } from '../lib/Config';
import { UserSocialProfile } from '../models/UserSocialProfile';
import { User } from '../models/User';

export interface IProfile {
    id: string | number;
    username: string;
    displayName: string;
}

/**
 * Gets the user associated with a profile.
 * @param profile A person's Passport profile.
 */
export async function getOrCreateUser(sequelizeDb: Sequelize, profile: IProfile): Promise<User> {
    const { id, displayName, username } = profile;

    if (!id) throw new Error("Social profile is missing an Id.");
    if (!displayName) throw new Error("Social profile is missing a Display Name.");
    if (!username) throw new Error("Social profile is missing a Username.");

    return sequelizeDb.transaction(transaction =>
        UserSocialProfile.findOrCreate({
            transaction,
            limit: 1,
            where: { externalId: id },
            defaults: { externalId: id, displayName, username },
            include: [User],
        }).then(
            ([socialProfile, wasCreated]) => {
                if (socialProfile.user) {
                    return socialProfile.user;
                }
                else {
                    return User.create(
                        {
                            
                        },
                        {
                            transaction,
                        }
                    );
                }
            }
        )
    );
}


/**
 * Sets up Passport for user logins.
 * @param options The global app options.
 * @param sequelizeDb The sequelize database to use for users.
 */
export function setupPassport(options: IConfig, sequelizeDb: Sequelize) {

    const passport = new Authenticator() as object as Authenticator;
    passport.use(
        new TwitterStrategy(
            {
                consumerKey: options.web.auth.twitter.consumerKey,
                consumerSecret: options.web.auth.twitter.consumerSecret,
                callbackURL: `https://${options.web.domain}/auth/twitter/callback`
            },
            (token, tokenSecret, profile, onDone) => {
                //
            }
        )
    );

    passport.serializeUser((user: User, onDone) => {
        console.log("Serializing User:");
        console.log(user);
        onDone(null, user.id as number);
    });

    passport.deserializeUser((id: number, onDone) => {
        console.log(`Deserializing User Id: ${id}`);
        User.findById(id).then(
            user => onDone(null, user as {}),
            onDone
        );
    });

    return passport;

}
