/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Sequelize, Table, Column, Model, HasMany, AllowNull } from 'sequelize-typescript';

import { ENTITY_NAME_MAX_LENGTH, ENTITY_SHORT_DESCRIPTION_MAX_LENGTH } from '../lib/Constants';

import { Project } from './Project';
import { TeamMember } from './TeamMember';

/**
 * A development Team.
 */
@Table({
    timestamps: true
})
export class Team extends Model<Team> {

    /** The Team's name. */
    @AllowNull(false)
    @Column(Sequelize.STRING(ENTITY_NAME_MAX_LENGTH))
    public name!: string;

    /** A short description of the Team. */
    @Column(Sequelize.STRING(ENTITY_SHORT_DESCRIPTION_MAX_LENGTH))
    public summary!: string;

    /** A long description for the Team. */
    @Column(Sequelize.TEXT)
    public description!: string;

    /** The Projects this team is working on. */
    @HasMany(() => Project)
    public projects!: Project[];

    /** The Developers who are on this Team. */
    @HasMany(() => TeamMember)
    public members!: TeamMember[];
}
