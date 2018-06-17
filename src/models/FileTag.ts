/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';

import { File } from './File';
import { Tag } from './Tag';

/**
 * Tags for a File.
 */
@Table({
    timestamps: true
})
export class FileTag extends Model<FileTag> {

    /** The Id of the File. */
    @ForeignKey(() => File)
    @Column
    public fileId!: number;

    /** The Id of the Tag */
    @ForeignKey(() => Tag)
    @Column
    public tagId!: number;

}
