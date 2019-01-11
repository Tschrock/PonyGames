/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Sequelize, Table, Column, Model, AllowNull, ForeignKey, BelongsTo, BelongsToMany, HasMany, NotEmpty } from 'sequelize-typescript';

import { ENTITY_NAME_MAX_LENGTH, ENTITY_SHORT_DESCRIPTION_MAX_LENGTH } from '../lib/Constants';

import { Team } from './Team';
import { Tag } from './Tag';
import { ProjectTag } from './ProjectTag';
import { FileGroup } from './FileGroup';

/**
 * A Project.
 */
@Table({
    timestamps: true
})
export class Project extends Model<Project> {

    /** The Project's name. */
    @AllowNull(false)
    @NotEmpty
    @Column(Sequelize.STRING(ENTITY_NAME_MAX_LENGTH))
    public name!: string;

    /** A short description of the Project. */
    @Column(Sequelize.STRING(ENTITY_SHORT_DESCRIPTION_MAX_LENGTH))
    public summary!: string;

    /** A long description for the Project. */
    @Column(Sequelize.TEXT)
    public description!: string;

    /** The Id of the development Team for the Project. */
    @ForeignKey(() => Team)
    @Column(Sequelize.INTEGER)
    public teamId!: number;

    /** The the development Team for the Project. */
    @BelongsTo(() => Team)
    public team!: Team;

    /** The Project's Tags. */
    @BelongsToMany(() => Tag, () => ProjectTag)
    public tags!: Tag[];

    /** The Project's File Groups */
    @HasMany(() => FileGroup)
    public fileGroups!: FileGroup[];

}
