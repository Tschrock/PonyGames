/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize, Table, Column, Model, HasMany, BelongsToMany } from 'sequelize-typescript';
import { File } from './File';


/**
 * A downloadable file.
 */
@Table({
    timestamps: true
})
export class FileGroup extends Model<FileGroup> {

    /** A descriptive title for the File Group. */
    @Column
    public title!: string;

    /** The Files in this Group. */
    @HasMany(() => File)
    public files!: File[];

}
