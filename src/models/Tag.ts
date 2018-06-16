/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize, Table, Column, Model, AllowNull, BelongsToMany } from 'sequelize-typescript';

import { Project } from './Project';
import { ProjectTag } from './ProjectTag';

/**
 * A Tag.
 */
@Table({
    timestamps: true
})
export class Tag extends Model<Tag> {

    /** The name of the Tag. */
    @AllowNull(false)
    @Column
    public key!: string;

    /** The hexidecimal color of the Tag. */
    @Column
    public color!: string;

    /** The description of the Tag. */
    @Column(Sequelize.TEXT)
    public description!: string;

    /** The projects that have this Tag. */
    @BelongsToMany(() => Project, () => ProjectTag)
    public projects!: Project[];

}
