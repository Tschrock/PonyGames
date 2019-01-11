/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { use, expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import 'mocha';


import * as Util from '../../src/lib/Util';

// Setup Chai-as-promised
use(chaiAsPromised);

describe('Number Utilities', () => {

    describe('GetPsuedoRandomInt', () => {

        describe('lower bound', () => {
            let OldRandom: () => number;

            before(() => {
                OldRandom = Math.random;
                Math.random = () => 0;
            });

            it('Should respect the lower bound', () => {
                expect(Util.GetPsuedoRandomInt(-10, 20)).equals(-10);
                expect(Util.GetPsuedoRandomInt(0, 20)).equals(0);
                expect(Util.GetPsuedoRandomInt(10, 20)).equals(10);
            });

            after(() => {
                Math.random = OldRandom;
            });
        });

        describe('upper bound', () => {
            let OldRandom: () => number;

            before(() => {
                OldRandom = Math.random;
                Math.random = () => 1 - Number.EPSILON;
            });

            it('Should respect the lower bound', () => {
                expect(Util.GetPsuedoRandomInt(-20, -10)).equals(-10);
                expect(Util.GetPsuedoRandomInt(-20, 0)).equals(0);
                expect(Util.GetPsuedoRandomInt(-20, 10)).equals(10);
            });

            after(() => {
                Math.random = OldRandom;
            });
        });

    });

});

describe('Array Utilities', () => {

    describe('ArrayLeftDiff', () => {
        it('Should return the left-handed difference', () => {
            expect(
                Util.ArrayLeftDiff(
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    [1, 4, 5, 8, 10, 11, 12]
                )
            ).deep.equals(
                [0, 2, 3, 6, 7, 9]
            );
        });
    });

    describe('ArrayIntersect', () => {
        it('Should return the intersection', () => {
            expect(
                Util.ArrayIntersect(
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    [1, 4, 5, 8, 10, 11, 12]
                )
            ).deep.equals(
                [1, 4, 5, 8]
            );
        });
    });

    describe('ArraySymetricDiff', () => {
        it('Should return the symetric difference', () => {
            expect(
                Util.ArraySymetricDiff(
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    [1, 4, 5, 8, 10, 11, 12]
                )
            ).deep.equals(
                [0, 2, 3, 6, 7, 9, 10, 11, 12]
            );
        });
    });

});

describe('Promise Utilities', () => {

    describe('Promise2Callback', () => {

        it('Should send a resolved promise to callback(null, value)', () => {
            return expect(

                Util.Promise2Callback(Promise.resolve(1), (err, val) => {
                    expect(err).is.null;
                    expect(val).equals(1);
                })

            ).to.be.fulfilled
        });

        it('Should send a rejected promise to callback(error, null)', () => {
            return expect(

                Util.Promise2Callback(Promise.reject(new Error('Test')), (err, val) => {
                    expect(err).to.exist
                        .and.be.instanceof(Error)
                        .and.have.property('message', 'Test');
                    expect(val).to.not.exist;
                })
                
            ).to.be.fulfilled
        });

    });

});
