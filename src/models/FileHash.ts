/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Table, Column, Model, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';

import { File } from './File';
import { HashType } from './HashType';

/**
 * A Hash for a File.
 */
@Table({
    timestamps: true
})
export class FileHash extends Model<FileHash> {

    /** The Id of the File this hash is for. */
    @ForeignKey(() => File)
    @Column
    public fileId!: number;

    /** The File this hash is for. */
    @BelongsTo(() => File)
    public file!: File;

    /** The Id of the Type of Hash this is. */
    @ForeignKey(() => HashType)
    @Column
    public hashTypeId!: number;

    /** The Type of Hash this is. */
    @BelongsTo(() => HashType)
    public hashType!: HashType;

    /** The value of this hash. */
    @Column
    public value!: string;

}
