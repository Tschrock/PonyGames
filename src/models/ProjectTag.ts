import { Table, Column, Model, ForeignKey } from 'sequelize-typescript';

import { Project } from './Project';
import { Tag } from './Tag';

@Table({
    timestamps: true
})
export class ProjectTag extends Model<ProjectTag> {

    // Project
    @ForeignKey(() => Project)
    @Column
    projectId!: number;

    // Tag
    @ForeignKey(() => Tag)
    @Column
    tagId!: number;

}
