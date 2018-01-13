import { Sequelize, Table, Column, Model, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';

import { Team } from './Team';
import { Developer } from './Developer';
import { Role } from './Role';
import { TeamDeveloperRole } from './TeamDeveloperRole';

@Table({
    timestamps: true
})
export class TeamDeveloper extends Model<TeamDeveloper> {

    // Team
    @ForeignKey(() => Team)
    @Column
    teamId: number;
    
    @BelongsTo(() => Team)
    team: Team;

    // Developer
    @ForeignKey(() => Developer)
    @Column
    developerId: number;
    
    @BelongsTo(() => Developer)
    developer: Developer;

    // Roles
    @BelongsToMany(() => Role, () => TeamDeveloperRole)
    roles: Role[];

}