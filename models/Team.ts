import { Sequelize, Table, Column, Model, HasMany, AllowNull } from 'sequelize-typescript';

import { Project } from './Project';
import { TeamDeveloper } from './TeamDeveloper';

@Table({
    timestamps: true
})
export class Team extends Model<Team> {

    @AllowNull(false)
    @Column
    name!: string;

    @Column(Sequelize.TEXT)
    shortDescription!: string;

    @Column(Sequelize.TEXT)
    description!: string;

    @HasMany(() => Project)
    projects!: Project[];

    @HasMany(() => TeamDeveloper)
    teamDevelopers!: TeamDeveloper[];
}
