/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Table, Column, Model, ForeignKey, BelongsTo, AllowNull } from 'sequelize-typescript';

import { Team } from './Team';
import { Developer } from './Developer';

/**
 * A team member.
 */
@Table({
    timestamps: true
})
export class TeamMember extends Model<TeamMember> {

    /** The Id of the Team the Developer is on. */
    @ForeignKey(() => Team)
    @Column
    public teamId!: number;

    /** The Team the Developer is on. */
    @BelongsTo(() => Team)
    public team!: Team;

    /** The Id of the Developer. */
    @ForeignKey(() => Developer)
    @Column
    public developerId!: number;

    /** The Developer. */
    @BelongsTo(() => Developer)
    public developer!: Developer;

    /** The Roles the Developer has on this Team. */
    // Roles
    @AllowNull(false)
    @Column
    public roles!: string;

}
