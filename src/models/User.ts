/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize, Table, Column, Model, BelongsTo, AllowNull, ForeignKey, IsNumeric } from 'sequelize-typescript';

import { ENTITY_NAME_MAX_LENGTH } from '../lib/Constants';

import { Developer } from './Developer';

/**
 * A Developer.
 */
@Table({
    timestamps: true
})
export class User extends Model<User> {

    /** The User's username. */
    @AllowNull(false)
    @Column(Sequelize.STRING(ENTITY_NAME_MAX_LENGTH))
    public username!: string;

    /** The User's name. */
    @AllowNull(false)
    @Column(Sequelize.STRING(ENTITY_NAME_MAX_LENGTH))
    public name!: string;

    /** The User's Twitter Id. */
    @Column
    public twitterId!: string;

    /** The connected Developer Id. */
    @ForeignKey(() => Developer)
    @Column
    public developerId!: number;

    /** The connected Developer. */
    @BelongsTo(() => Developer)
    public developer!: Developer;

}
