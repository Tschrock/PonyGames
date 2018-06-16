/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize, Table, Column, Model, AllowNull, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';

import { Team } from './Team';
import { Tag } from './Tag';
import { ProjectTag } from './ProjectTag';

/**
 * A Project.
 */
@Table({
    timestamps: true
})
export class Project extends Model<Project> {

    /** The Project's name. */
    @AllowNull(false)
    @Column
    public name!: string;

    /** A short description of the Project. */
    @Column(Sequelize.TEXT)
    public shortDescription!: string;

    /** A long description for the Project. */
    @Column(Sequelize.TEXT)
    public description!: string;

    /** The Id of the development Team for the Project. */
    @AllowNull(false)
    @ForeignKey(() => Team)
    @Column
    public teamId!: number;

    /** The the development Team for the Project. */
    @BelongsTo(() => Team)
    public team!: Team;

    /** The Project's Tags. */
    @BelongsToMany(() => Tag, () => ProjectTag)
    public tags!: Tag[];

}
