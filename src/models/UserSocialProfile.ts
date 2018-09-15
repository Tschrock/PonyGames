/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize, Table, Column, Model, BelongsTo, AllowNull, ForeignKey, Default } from 'sequelize-typescript';

import { SHORT_STRING_MAX_LENGTH } from '../lib/Constants';
import { User } from './User';


/**
 * A Social Profile.
 */
@Table({
    timestamps: true
})
export class UserSocialProfile extends Model<UserSocialProfile> {

    // Database Fields

    /** The type of Social Profile. */
    @AllowNull(false)
    @Column(Sequelize.STRING(SHORT_STRING_MAX_LENGTH))
    public provider!: string;

    /** The Id */
    @AllowNull(false)
    @Column(Sequelize.STRING(SHORT_STRING_MAX_LENGTH))
    public externalId!: string;

    /** The Username. */
    @AllowNull(false)
    @Column(Sequelize.STRING(SHORT_STRING_MAX_LENGTH))
    public username!: string;

    /** The Display Name. */
    @AllowNull(false)
    @Column(Sequelize.STRING(SHORT_STRING_MAX_LENGTH))
    public displayName!: string;

    /** The Id of the User this Social Profile belongs to. */
    @ForeignKey(() => User)
    @Column
    public userId!: number;

    /** If the User should be able to login with this Social Profile */
    @AllowNull(false)
    @Default(true)
    @Column
    public canLogin!: boolean;

    // Virtual Properties

    /** The User this Social Profile belongs to. */
    @BelongsTo(() => User)
    public user!: User;

}
