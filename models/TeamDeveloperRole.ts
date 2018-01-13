import { Sequelize, Table, Column, Model, ForeignKey } from 'sequelize-typescript';

import { TeamDeveloper } from './TeamDeveloper';
import { Role } from './Role';

@Table({
    timestamps: true
})
export class TeamDeveloperRole extends Model<TeamDeveloperRole> {

    @ForeignKey(() => TeamDeveloper)
    @Column
    teamDeveloperId: number;
  
    @ForeignKey(() => Role)
    @Column
    roleId: number;

}