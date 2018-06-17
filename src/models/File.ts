/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize, Table, Column, Model, HasMany, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { Tag } from './Tag';
import { FileTag } from './FileTag';
import { FileHash } from './FileHash';
import { FileGroup } from './FileGroup';

/**
 * A downloadable file.
 */
@Table({
    timestamps: true
})
export class File extends Model<File> {

    /** A descriptive title for the file. */
    @Column
    public title!: string;

    /** The filename. */
    @Column
    public filename!: string;

    /** The version of the file. */
    @Column
    public version!: string;

    /** The version order of the file (Because some people are derp and change versioning weirdly). */
    @Column
    public versionOrder!: number;

    /** The File's Tags. */
    @BelongsToMany(() => Tag, () => FileTag)
    public tags!: Tag[];

    /** The Hashes for this File. */
    @HasMany(() => FileHash)
    public fileHashes!: FileHash[];

    /** Whether or not the File is available for download. */
    @Column
    public isAvailable!: boolean;

    /** A message describing why the File is unavailable. */
    @Column(Sequelize.TEXT)
    public unavailableMessage!: string;

    /** The Id of the File's Group. */
    @ForeignKey(() => FileGroup)
    @Column
    public fileGroupId!: number;

    /** The File's Group. */
    @BelongsTo(() => FileGroup)
    public fileGroup!: FileGroup;

}
