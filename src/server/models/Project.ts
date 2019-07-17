/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Table, Column, AllowNull, BelongsToMany } from 'sequelize-typescript';


import { PGModel } from '../PGModel';

import { Link } from './Link';
import { ProjectLink } from './ProjectLink';

import { Image } from './Image';
import { ProjectImage } from './ProjectImage';

@Table
export class Project extends PGModel<Project> {

    @AllowNull(false)
    @Column
    name!: string;

    @Column
    team_name!: string;

    @Column
    description!: string;

    @BelongsToMany(() => Link, () => ProjectLink)
    links!: Link[];

    @BelongsToMany(() => Image, () => ProjectImage)
    images!: Image[];

    get url() {
        return `/projects/${this.id}`;
    }
}
