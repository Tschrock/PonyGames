/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize, Table, Column, Model, HasMany, AllowNull } from 'sequelize-typescript';

import { Project } from './Project';
import { TeamDeveloper } from './TeamDeveloper';

/**
 * A development Team.
 */
@Table({
    timestamps: true
})
export class Team extends Model<Team> {

    /** The Team's name. */
    @AllowNull(false)
    @Column
    public name!: string;

    /** A short description of the Team. */
    @Column(Sequelize.TEXT)
    public shortDescription!: string;

    /** A long description for the Team. */
    @Column(Sequelize.TEXT)
    public description!: string;

    /** The Projects this team is working on. */
    @HasMany(() => Project)
    public projects!: Project[];

    /** The Developers who are on this Team. */
    @HasMany(() => TeamDeveloper)
    public teamDevelopers!: TeamDeveloper[];
}
