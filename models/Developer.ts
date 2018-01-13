import { Sequelize, Table, Column, Model, HasMany, AllowNull } from 'sequelize-typescript';

import { TeamDeveloper } from './TeamDeveloper';

@Table({
    timestamps: true
})
export class Developer extends Model<Developer> {

    @AllowNull(false)
    @Column
    name: string;

    @Column(Sequelize.TEXT)
    shortDescription: string;

    @Column(Sequelize.TEXT)
    description: string;

    @HasMany(() => TeamDeveloper)
    teamDevelopers: TeamDeveloper[];

}