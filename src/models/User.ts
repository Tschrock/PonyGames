/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize, Table, Column, Model, BelongsTo, AllowNull, ForeignKey, IsNumeric, HasMany, Unique } from 'sequelize-typescript';

import { ENTITY_NAME_MAX_LENGTH } from '../lib/Constants';

import { Developer } from './Developer';
import { UserSocialProfile } from './UserSocialProfile';

/**
 * A User.
 */
@Table({
    timestamps: true
})
export class User extends Model<User> {

    /** The User's username. */
    @Unique
    @AllowNull(false)
    @Column(Sequelize.STRING(ENTITY_NAME_MAX_LENGTH))
    public username!: string;

    /** The User's name. */
    @AllowNull(false)
    @Column(Sequelize.STRING(ENTITY_NAME_MAX_LENGTH))
    public name!: string;

    /** The Id of the User's Developer Profile. */
    @ForeignKey(() => Developer)
    @Column
    public developerId!: number;

    /** The User's Developer Profile. */
    @BelongsTo(() => Developer)
    public developer!: Developer;

    /** The User's SocialProfiles */
    @HasMany(() => UserSocialProfile)
    public socialProfiles!: UserSocialProfile[];

}
