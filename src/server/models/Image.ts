/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Table, Column, AllowNull, BelongsToMany } from 'sequelize-typescript';

import { PGModel} from '../PGModel';

import { Project } from './Project';
import { ProjectImage } from './ProjectImage';

function slash(string: string) {
    return string ? string + "/" : "";
}

@Table
export class Image extends PGModel<Image> {

    @AllowNull(false)
    @Column
    extension!: string;

    @Column
    mimetype!: string;

    @Column
    size!: number;

    @Column
    height!: number;

    @Column
    width!: number;

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
        return `${this.storage_server}/${slash(this.storage_bucket)}${slash(this.storage_prefix)}${this.guid}.${this.extension}`;
    }

}
