import { Sequelize, Table, Column, Model, AllowNull, BelongsToMany } from 'sequelize-typescript';

import { Project } from './Project';
import { ProjectTag } from './ProjectTag';

@Table({
    timestamps: true
})
export class Tag extends Model<Tag> {
    // Name
    @AllowNull(false)
    @Column
    key!: string;

    // Color
    @Column
    color!: string;

    // Description
    @Column(Sequelize.TEXT)
    description!: string;

    @BelongsToMany(() => Project, () => ProjectTag)
    projects!: Project[];

}
