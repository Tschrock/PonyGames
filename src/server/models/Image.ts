/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Table, Column, Model, PrimaryKey, AllowNull, BelongsToMany, Unique, AutoIncrement } from 'sequelize-typescript';

import { Project } from './Project';
import { ProjectImage } from './ProjectImage';

function slash(string: string) {
    return string ? string + "/" : "";
}

@Table
export class Image extends Model<Image> {

    @PrimaryKey
    @AutoIncrement
    @AllowNull(false)
    @Column
    id!: number;

    @Unique
    @AllowNull(false)
    @Column
    guid!: string;

    @AllowNull(false)
    @Column
    extension!: string;

    @Column
    mimetype!: string;

    @Column
    size!: number;

    @Column
    storage_prefix!: string;

    @Column
    storage_bucket!: string;

    @Column
    storage_server!: string;

    @Column
    filename!: string;

    @BelongsToMany(() => Project, () => ProjectImage)
    projects!: Project[];

    public get url() {
        return `${this.storage_server}/${slash(this.storage_bucket)}${slash(this.storage_prefix)}${this.guid}.${this.extension}`
    }

}
