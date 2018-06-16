/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize, Table, Column, Model, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { TeamDeveloper } from './TeamDeveloper';

/**
 * A Role for a Team Developer.
 */
@Table({
    timestamps: true
})
export class Role extends Model<Role> {

    /** The name of the Role. */
    @AllowNull(false)
    @Column
    public name!: string;

    /** The Id of the Team Developer. */
    @ForeignKey(() => TeamDeveloper)
    @Column
    public teamDeveloperId!: number;

    /** The Team Developer. */
    @BelongsTo(() => TeamDeveloper)
    public teamDeveloper!: TeamDeveloper;

}
