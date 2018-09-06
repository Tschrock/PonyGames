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
import { User } from '../models/User';

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
                // In this example, the user's Twitter profile is supplied as the user
                // record.  In a production-quality application, the Twitter profile should
                // be associated with a user record in the application's database, which
                // allows for account linking and authentication with other identity
                // providers.
                console.log("New Twitter Login with Profile:");
                console.log(profile);
                User.findOrCreate({
                    where:  { twitterId: profile.id },
                    limit: 1,
                    defaults: {
                        twitterId: profile.id,
                        name: profile.displayName,
                        username: profile.username
                    }
                }).then(
                    user => onDone(null, user[0]),
                    onDone
                );
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
