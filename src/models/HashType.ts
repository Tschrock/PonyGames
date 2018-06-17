/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Sequelize, Table, Column, Model, AllowNull, BelongsToMany } from 'sequelize-typescript';

/**
 * A HashType.
 */
@Table({
    timestamps: true
})
export class HashType extends Model<HashType> {

    /** The name of the Hash Type. */
    @Column
    public name!: string;

    /** The description of the Hash Type. */
    @Column(Sequelize.TEXT)
    public description!: string;

    /** Whether or not the hash is still secure/useable. */
    @Column
    public isDepreciated!: boolean;

    /** A message describing why the hash is depreciated. */
    @Column(Sequelize.TEXT)
    public depreciationMessage!: string;

}
