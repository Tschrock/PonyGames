/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { use, expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as faker from 'faker';
import 'mocha';

import { clearTestDB, TestDB } from '../meta/DbUtils';
import { ITestData, checkPropertyValues, serializePromises } from '../meta/Util';

import { Profile } from 'passport';

import * as Auth from '../../src/lib/Auth';
import { UserSocialProfile } from '../../src/models/UserSocialProfile';
import { User } from '../../src/models/User';
import { IConfig } from '../../src/lib/Config';

function makeTestProfileData(provider: string, id: string): { passport: Profile, dbprofile: ITestData } {
    const username = faker.internet.userName(), displayName = faker.name.findName();
    return {
        passport: { provider, id, username, displayName, randomProp: faker.random.word() } as Profile,
        dbprofile: { provider, externalId: id, username, displayName, canLogin: true } as ITestData
    };
}

// 4 test profiles
const socialTestData = [
    makeTestProfileData('service1', 'user1'),
    makeTestProfileData('service1', 'user2'),
    makeTestProfileData('service2', 'user1'),
    makeTestProfileData('service2', 'user2')
]

async function resetSocialProfiles() {
    return clearTestDB().then(_ => Promise.all(socialTestData.map(data => UserSocialProfile.create(data.dbprofile))));
}

async function resetUsers() {
    return clearTestDB().then(_ => serializePromises(data => Auth.getOrCreateUser(TestDB, data.passport), socialTestData));
}

// Setup Chai-as-promised
use(chaiAsPromised);

describe('Auth Utilities', () => {

    describe('checkProfileData', () => {

        it('Should pass a full profile', () => {
            expect(Auth.checkProfileData.bind(Auth, socialTestData[0].passport)).to.not.throw;
        });

        it('Should fail an incomplete profile', () => {
            const { provider, id, username, displayName } = socialTestData[0].passport
            expect(Auth.checkProfileData.bind(Auth, { id, username, displayName })).to.throw('Social profile is missing a provider.');
            expect(Auth.checkProfileData.bind(Auth, { provider, username, displayName })).to.throw('Social profile is missing an Id.');
            expect(Auth.checkProfileData.bind(Auth, { provider, id, displayName })).to.throw('Social profile is missing a Username.');
            expect(Auth.checkProfileData.bind(Auth, { provider, id, username })).to.throw('Social profile is missing a Display Name.');
        });

    });

    describe('updateSocialProfile', () => {

        let socialProfile: UserSocialProfile;
        before(() => resetSocialProfiles().then(([p1]) => socialProfile = p1));

        it('Should update the social profile without error.', () => {
            return Auth.updateSocialProfile(socialProfile, socialTestData[1].passport)
        });

        const expectedSocialProfile: ITestData = {
            ...socialTestData[0].dbprofile,
            username: socialTestData[1].dbprofile.username,
            displayName: socialTestData[1].dbprofile.displayName,
        };

        it('Should have saved the correct updates to the database.', async () => {
            const profile = await UserSocialProfile.findById(socialProfile.id);
            checkPropertyValues(profile, expectedSocialProfile);
        });

    });

    describe('getOrCreateSocialProfile', () => {

        before(() => clearTestDB());

        socialTestData.forEach((data, i) => {

            let originalProfile: UserSocialProfile;

            it(`Should create social profile ${i + 1} with the right properties`, () => {
                return Auth.getOrCreateSocialProfile(data.passport).then(([socialProfile, wasCreated]) => {
                    expect(wasCreated).to.be.true;
                    originalProfile = socialProfile;
                    checkPropertyValues(socialProfile, data.dbprofile);
                });
            });

            it(`Should get social profile ${i + 1} with the right properties`, () => {
                return Auth.getOrCreateSocialProfile(data.passport).then(([socialProfile, wasCreated]) => {
                    expect(wasCreated).to.be.false;
                    expect(originalProfile.id).to.equal(socialProfile.id)
                    checkPropertyValues(socialProfile, data.dbprofile);
                });
            });
        });

    });

    describe('getSocialProfile', () => {

        before(() => clearTestDB());

        const updatedSocialData: Profile = {
            ...socialTestData[0].passport,
            username: socialTestData[1].passport.username,
            displayName: socialTestData[1].passport.displayName,
        };

        const expectedSocialProfile: ITestData = {
            ...socialTestData[0].dbprofile,
            username: socialTestData[1].dbprofile.username,
            displayName: socialTestData[1].dbprofile.displayName,
        };

        let originalProfile: UserSocialProfile;

        it(`Should get social profile 1 with the right properties`, () => {
            return Auth.getSocialProfile(socialTestData[0].passport).then(socialProfile => {
                originalProfile = socialProfile;
                checkPropertyValues(socialProfile, socialTestData[0].dbprofile);
            });
        });

        it(`Should get an updated social profile 1 with the right properties`, () => {
            return Auth.getSocialProfile(updatedSocialData).then(socialProfile => {
                expect(originalProfile.id).to.equal(socialProfile.id)
                checkPropertyValues(socialProfile, expectedSocialProfile);
            });
        });

    });

    describe('createNewUser', () => {

        let socialProfile: UserSocialProfile;
        before(() => resetSocialProfiles().then(([p1]) => socialProfile = p1));

        let OldRandom: () => number;
        before(() => {
            OldRandom = Math.random;
            Math.random = () => 0;
        });

        it('Should create a new user', () => {
            return Auth.createNewUser(socialProfile).then(user => {
                expect(user).to.have.property('username', socialProfile.username);
                expect(user).to.have.property('name', socialProfile.displayName);
            });
        });

        it('Should create a new user with modified username', () => {
            return Auth.createNewUser(socialProfile).then(user => {
                expect(user).to.have.property('username', `${socialProfile.provider}-${socialProfile.username}`);
                expect(user).to.have.property('name', socialProfile.displayName);
            });
        });

        it('Should create a new user with modified username', () => {
            return Auth.createNewUser(socialProfile).then(user => {
                expect(user).to.have.property('username', `${socialProfile.provider}-${socialProfile.username}-0`);
                expect(user).to.have.property('name', socialProfile.displayName);
            });
        });

        it('Should throw a username taken error', () => {
            return expect(Auth.createNewUser(socialProfile)).to.be.rejectedWith(Auth.UsernameTakenError);
        });

        it('Should throw an error', () => {
            return expect(Auth.createNewUser({} as any as UserSocialProfile)).to.be.rejectedWith(Error);
        });

        after(() => {
            Math.random = OldRandom;
        });

    });

    describe('getOrCreateUser', () => {

        before(() => clearTestDB());

        socialTestData.forEach((data, i) => {

            let originalUser: User;

            it(`Should create user ${i + 1}`, () => {
                return Auth.getOrCreateUser(TestDB, data.passport).then(user => {
                    originalUser = user;
                });
            });

            it(`Should get user ${i + 1}`, () => {
                return Auth.getOrCreateUser(TestDB, data.passport).then(user => {
                    expect(user.id).to.equal(originalUser.id)
                });
            });
        });

    });

    describe('buildVerifyFunction', () => {

        it('Should return a verify function', () => {
            const func = Auth.buildVerifyFunction(TestDB);
            expect(func.length).to.equal(4);
        });

    });

    describe('serializeUser', () => {

        let user: User;
        before(() => resetUsers().then(([p1]) => user = p1));

        it("Should call onDone with the user's id", () => {
            Auth.serializeUser(user, (err, val) => {
                expect(err).to.not.exist;
                expect(val).to.equal(user.id);
            });
        });

    });

    describe('deserializeUser', () => {

        let user: User;
        before(() => resetUsers().then(([p1]) => user = p1));

        it("Should call onDone with the user", () => {
            return Auth.deserializeUser(user.id, (err, val) => {
                expect(err).to.not.exist;
                expect(val).to.exist;
                if(val) checkPropertyValues(val, {
                    id: user.id,
                    name: user.name,
                    username: user.username
                });
            });
        });

    });

    describe('getAuthOptions', () => {

        const optionData: IConfig = {
            web: {
                protocol: 'proxy',
                domain: 'example.com',
                port: 9090,
                auth: {
                    test: {
                        prop1: 'val1',
                        prop2: 'val2',
                    }
                }
            }
        };

        it("Should get the right options for proxy", () => {
            var options = Auth.getAuthOptions(optionData, 'test');
            expect(options).deep.equals({
                prop1: 'val1',
                prop2: 'val2',
                callbackURL: 'https://example.com/auth/test/callback'
            })
        });

        it("Should get the right options for http", () => {
            optionData.web.protocol = 'http';
            var options = Auth.getAuthOptions(optionData, 'test');
            expect(options).deep.equals({
                prop1: 'val1',
                prop2: 'val2',
                callbackURL: 'http://example.com/auth/test/callback'
            })
        });

        it("Should get the right options for https", () => {
            optionData.web.protocol = 'https';
            var options = Auth.getAuthOptions(optionData, 'test');
            expect(options).deep.equals({
                prop1: 'val1',
                prop2: 'val2',
                callbackURL: 'https://example.com/auth/test/callback'
            })
        });

    });

});
