/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';

import { Project } from './Project';
import { Tag } from './Tag';

/**
 * Tags for a Project.
 */
@Table({
    timestamps: true
})
export class ProjectTag extends Model<ProjectTag> {

    /** The Id of the project. */
    @ForeignKey(() => Project)
    @Column
    public projectId!: number;

    /** The Id of the Tag */
    @ForeignKey(() => Tag)
    @Column
    public tagId!: number;

}
