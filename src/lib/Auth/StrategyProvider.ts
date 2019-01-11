/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Strategy } from 'passport';
import { VerifyFunction } from './PassportUtil';

export interface IStrategyOptions {
    [key: string]: {};
}

export type StrategyType = new (options: IStrategyOptions, verifyFunction: VerifyFunction) => Strategy;

export class StrategyProvider {

    private _id: string;
    get id() {
        return this._id;
    }

    private _name: string;
    get name() {
        return this._name;
    }

    private _Strategy: StrategyType;
    get Strategy() {
        return this._Strategy;
    }

    private _strategyOptions: IStrategyOptions;
    get strategyOptions() {
        return this._strategyOptions;
    }

    constructor(id: string, name: string, Strategy: StrategyType, strategyOptions: IStrategyOptions) {
        this._id = id;
        this._name = name;
        this._Strategy = Strategy;
        this._strategyOptions = strategyOptions;
    }

    public buildStrategy(callbackURL: string, verifyFunction: VerifyFunction): Strategy {
        return new this.Strategy({ callbackURL, ...this.strategyOptions }, verifyFunction);
    }
}
