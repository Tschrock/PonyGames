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

import { clearTestDB, TestDB } from '../../meta/DbUtils';
import { ITestData, checkPropertyValues, serializePromises } from '../../meta/Util';

import { Profile } from 'passport';

import * as DbUtil from '../../../src/lib/Auth/DbUtil';
import * as PassportUtil from '../../../src/lib/Auth/PassportUtil';
import { UserSocialProfile } from '../../../src/models/UserSocialProfile';
import { User } from '../../../src/models/User';

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
    return clearTestDB().then(_ => serializePromises(data => DbUtil.getOrCreateUser(TestDB, data.passport), socialTestData));
}

// Setup Chai-as-promised
use(chaiAsPromised);

describe('Auth/Passport Utilities', () => {

    describe('checkProfileData', () => {

        it('Should pass a full profile', () => {
            expect(PassportUtil.checkProfileData.bind(PassportUtil, socialTestData[0].passport)).to.not.throw;
        });

        it('Should fail an incomplete profile', () => {
            const { provider, id, username, displayName } = socialTestData[0].passport
            expect(PassportUtil.checkProfileData.bind(PassportUtil, { id, username, displayName })).to.throw('Social profile is missing a provider.');
            expect(PassportUtil.checkProfileData.bind(PassportUtil, { provider, username, displayName })).to.throw('Social profile is missing an Id.');
            expect(PassportUtil.checkProfileData.bind(PassportUtil, { provider, id, displayName })).to.throw('Social profile is missing a Username.');
            expect(PassportUtil.checkProfileData.bind(PassportUtil, { provider, id, username })).to.throw('Social profile is missing a Display Name.');
        });

    });

    describe('buildVerifyFunction', () => {

        it('Should return a verify function', () => {
            const func = PassportUtil.buildVerifyFunction(TestDB);
            expect(func.length).to.equal(4);
        });

    });

    describe('serializeUser', () => {

        let user: User;
        before(() => resetUsers().then(([p1]) => user = p1));

        it("Should call onDone with the user's id", () => {
            PassportUtil.serializeUser(user, (err, val) => {
                expect(err).to.not.exist;
                expect(val).to.equal(user.id);
            });
        });

    });

    describe('deserializeUser', () => {

        let user: User;
        before(() => resetUsers().then(([p1]) => user = p1));

        it("Should call onDone with the user", () => {
            return PassportUtil.deserializeUser(user.id, (err, val) => {
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

});
