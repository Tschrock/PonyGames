import { Sequelize, Table, Column, Model, AllowNull, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';

import { Team } from './Team';
import { Tag } from './Tag';
import { ProjectTag } from './ProjectTag';

@Table({
    timestamps: true
})
export class Project extends Model<Project> {

    @AllowNull(false)
    @Column
    name!: string;

    @Column(Sequelize.TEXT)
    shortDescription!: string;

    @Column(Sequelize.TEXT)
    description!: string;

    @AllowNull(false)
    @ForeignKey(() => Team)
    @Column
    teamId!: number;
    
    @BelongsTo(() => Team)
    team!: Team;

    @BelongsToMany(() => Tag, () => ProjectTag)
    tags!: Tag[];

}
