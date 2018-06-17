/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize, Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { File } from './File';

/**
 * A File Source that can be used to download a File.
 */
@Table({
    timestamps: true
})
export class FileSource extends Model<FileSource> {

    /** The display name for this source. */
    @Column
    public name!: string;

    /** The uri for this source */
    @Column
    public sourceUri!: string;

    /** Whether or not the File Source is still active. */
    @Column
    public isActive!: boolean;

    /** A message describing why the File Source is inactive. */
    @Column(Sequelize.TEXT)
    public inactiveMessage!: string;

    /** The Id of the File this Source is for. */
    @ForeignKey(() => File)
    @Column
    public fileId!: number;

    /** The File this Source is for. */
    @BelongsTo(() => File)
    public file!: File;

}
