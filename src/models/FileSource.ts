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
 * A team developer.
 */
@Table({
    timestamps: true
})
export class FileSource extends Model<FileSource> {


}
