/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Table, Column, Model, PrimaryKey, AllowNull, BelongsToMany, AutoIncrement } from 'sequelize-typescript';

import { Link } from './Link';
import { ProjectLink } from './ProjectLink';

import { Image } from './Image';
import { ProjectImage } from './ProjectImage';

@Table
export class Project extends Model<Project> {

    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column
    id!: number;

    @AllowNull(false)
    @Column
    name!: string;

    @Column
    team_name!: string;

    @Column
    image_url!: string;

    @Column
    description!: string;

    @BelongsToMany(() => Link, () => ProjectLink)
    links!: Link[];

    @BelongsToMany(() => Image, () => ProjectImage)
    images!: Image[];

}
