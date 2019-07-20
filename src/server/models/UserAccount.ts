/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Table, Column, AllowNull, Unique } from 'sequelize-typescript';

import { Constructor } from '../Utils';
import { PGModel } from '../PGModel';

/**
 * An account.
 */
@Table
export class UserAccount extends PGModel<UserAccount> {

    /** The Twitter Account Id */
    @Unique
    @AllowNull(false)
    @Column
    public externalId!: string;

    /** The Account's Name. */
    @AllowNull(false)
    @Column
    public name!: string;

    /** The Account's Email. */
    @AllowNull(false)
    @Column
    public email!: string;

    /** The Account's Auth Token. */
    @AllowNull(false)
    @Column
    public authToken!: string;

    /** The Account's Refresh Token. */
    @AllowNull(false)
    @Column
    public refreshToken!: string;

    public async checkEntityPermission<TModel extends PGModel<TModel>>(action: string, model: Constructor<TModel>, entity?: TModel): Promise<boolean> {
        return this.externalId === "787535265447325698";
    }

}
