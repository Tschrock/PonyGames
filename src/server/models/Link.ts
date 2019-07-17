/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Table, Column, AllowNull, BelongsToMany } from 'sequelize-typescript';

import { PGModel } from '../PGModel';

import { Project } from './Project';
import { ProjectLink } from './ProjectLink';

@Table
export class Link extends PGModel<Link> {

    @AllowNull(false)
    @Column
    name!: string;

    @Column
    icon_css_class!: string;

    @AllowNull(false)
    @Column
    url!: string;

    @BelongsToMany(() => Project, () => ProjectLink)
    projects!: Project[];

}
