/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize, Table, Column, Model, HasMany, AllowNull } from 'sequelize-typescript';

import { ENTITY_NAME_MAX_LENGTH, ENTITY_SHORT_DESCRIPTION_MAX_LENGTH } from '../lib/Constants';

import { TeamMember } from './TeamMember';

/**
 * A Developer.
 */
@Table({
    timestamps: true
})
export class Developer extends Model<Developer> {

    /** The Developer's name. */
    @AllowNull(false)
    @Column(Sequelize.STRING(ENTITY_NAME_MAX_LENGTH))
    public name!: string;

    /** A short description of the Developer. */
    @Column(Sequelize.STRING(ENTITY_SHORT_DESCRIPTION_MAX_LENGTH))
    public shortDescription!: string;

    /** A long description/bio for the Developer */
    @Column(Sequelize.TEXT)
    public description!: string;

    /** The Team connections this Developer has. */
    @HasMany(() => TeamMember)
    public teamMemberships!: TeamMember[];

}
