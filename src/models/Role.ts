import { Sequelize, Table, Column, Model, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { TeamDeveloper } from './TeamDeveloper';

@Table({
    timestamps: true
})
export class Role extends Model<Role> {
    // Name
    @AllowNull(false)
    @Column
    name!: string;

    // Developer
    @ForeignKey(() => TeamDeveloper)
    @Column
    teamDeveloperId!: number;
    
    @BelongsTo(() => TeamDeveloper)
    teamDeveloper!: TeamDeveloper;

}
