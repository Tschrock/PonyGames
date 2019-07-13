/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Table, Column, Model, PrimaryKey, AllowNull, BelongsToMany } from 'sequelize-typescript';

import { Link } from './Link';
import { ProjectLink } from './ProjectLink';

@Table
export class Project extends Model<Project> {

    @PrimaryKey
    @Column
    id!: number;

    @AllowNull(false)
    @Column
    name!: string;

    @Column
    team_name!: string;

    @Column
    image_url!: string;

    @BelongsToMany(() => Link, () => ProjectLink)
    links!: Link[];

}
