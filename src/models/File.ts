/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Sequelize, Table, Column, Model, HasMany, BelongsToMany, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { FileUploadStatus } from 'src/lib/FileUploadStatus';

import { Tag } from './Tag';
import { FileTag } from './FileTag';
import { FileHash } from './FileHash';
import { FileGroup } from './FileGroup';
import { FileSource } from './FileSource';

/**
 * A downloadable File.
 */
@Table({
    timestamps: true
})
export class File extends Model<File> {

    // General

    /** The filename. */
    @Column(Sequelize.STRING(255))
    public filename!: string;

    /** The mimetype. */
    @Column(Sequelize.STRING(255))
    public mimetype!: string;

    /** The size (in bytes). */
    @Column(Sequelize.INTEGER)
    public size!: number;

    // Display

    /** A display name for the file. */
    @Column(Sequelize.STRING(255))
    public displayname!: string;

    /** The version of the file. */
    @Column(Sequelize.STRING(255))
    public version!: string;

    /** The version order of the file (Because some people are derp and change versioning weirdly). */
    @Column(Sequelize.INTEGER)
    public versionOrder!: number;

    /** Whether or not the File is available for download. */
    @Column
    public isAvailable!: boolean;

    /** A message describing why the File is unavailable. */
    @Column(Sequelize.TEXT)
    public unavailableMessage!: string;

    /** The Hashes for this File. */
    @HasMany(() => FileHash)
    public fileHashes!: FileHash[];

    /** The Sources for this File. */
    @HasMany(() => FileSource)
    public fileSources!: FileSource[];

    // General Upload

    /** The upload status. */
    @Column(Sequelize.INTEGER)
    public uploadstatus!: FileUploadStatus;

    /** The client upload token. */
    @Column(Sequelize.STRING(255))
    public clientuploadtoken!: string;

    /** The time this File started being uploaded. */
    @Column
    public upload_started_at!: Date

    /** The time this File finished being uploaded. */
    @Column
    public upload_finished_at!: Date

    // B2 Upload

    /** The upload url. */
    @Column(Sequelize.TEXT)
    public b2uploadparturl!: string;

    /** The upload token. */
    @Column(Sequelize.TEXT)
    public b2uploadtoken!: string;

    /** The time the upload url will expire. */
    @Column(Sequelize.TEXT)
    public b2uploadurl_expires_at!: Date;

    // General Storage

    /** The storage url. */
    @Column(Sequelize.TEXT)
    public url!: string;

    // B2 Storage

    /** The storage account id. */
    @Column(Sequelize.TEXT)
    public b2accountid!: string;

    /** The storage bucket id. */
    @Column(Sequelize.TEXT)
    public b2bucketid!: string;

    /** The storage file id. */
    @Column(Sequelize.TEXT)
    public b2fileid!: string;

    /** The storage file name. */
    @Column(Sequelize.TEXT)
    public b2filename!: string;


    // Organization & Search

    /** The File's Tags. */
    @BelongsToMany(() => Tag, () => FileTag)
    public tags!: Tag[];

    /** The Id of the File's Group. */
    @ForeignKey(() => FileGroup)
    @Column
    public fileGroupId!: number;

    /** The File's Group. */
    @BelongsTo(() => FileGroup)
    public fileGroup!: FileGroup;

}
