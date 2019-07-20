/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Table, Column, Model, PrimaryKey, AllowNull, AutoIncrement, Unique } from 'sequelize-typescript';
import { InstanceUpdateOptions, SaveOptions } from 'sequelize/types';
import uuidv4 from 'uuid/v4';

import { UserAccount } from './models';

@Table({
    timestamps: true,
    paranoid: true,
    underscored: true,
    hooks: {
        beforeValidate: <T extends PGModel<T>>(instance: T, options: InstanceUpdateOptions | SaveOptions) => {
            if(!instance.guid) instance.guid = uuidv4();
        }
    }
})
export class PGModel<T extends PGModel<T>> extends Model<T> {

    @PrimaryKey
    @Unique
    @AutoIncrement
    @AllowNull(false)
    @Column
    id!: number;

    @Unique
    @AllowNull(false)
    @Column
    guid!: string;

    @Column
    createdAt!: Date;

    @Column
    modifiedAt!: Date;

    @Column
    deletedAt!: Date;

    public async checkUserPermission(user: UserAccount, action: string): Promise<boolean> {
        return user && user.externalId === "787535265447325698";
    }

}
