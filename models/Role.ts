import { Sequelize, Table, Column, Model, AllowNull, BelongsToMany } from 'sequelize-typescript';

import { TeamDeveloper } from './TeamDeveloper';
import { TeamDeveloperRole } from './TeamDeveloperRole';

@Table({
    timestamps: true
})
export class Role extends Model<Role> {
    // Name
    @AllowNull(false)
    @Column
    name: string;

    // Description
    @Column(Sequelize.TEXT)
    description: string;

    // TeamDevelopers
    @BelongsToMany(() => TeamDeveloper, () => TeamDeveloperRole)
    teamDevelopers: TeamDeveloper[];

}