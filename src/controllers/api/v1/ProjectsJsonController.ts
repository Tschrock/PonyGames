/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
'use strict';

// tslint:disable:prefer-function-over-method

import { JsonController, Get, QueryParams, Param, Post, Delete, Put, Patch, Body, UseAfter } from "routing-controllers";

import { IPaginateOptions, paginate } from "../../../lib/FindHelper";
import { Project } from "../../../models/Project";
import { Tag } from "../../../models/Tag";
import { File } from "../../../models/File";
import { FileGroup } from "../../../models/FileGroup";
import { Team } from "../../../models/Team";
import { NewProject } from "./params/NewProject";
import { JsonErrorHandler } from "./JsonErrorHandler";
import { validate } from "../../../lib/ValidationHelper";

/** ProjectsJsonController */
@JsonController()
@UseAfter(JsonErrorHandler)
export default class ProjectsJsonController {

    // ============================== //
    //       Controller Methods       //
    // ============================== //

    /**
     * Gets all projects.
     * @param pageOptions Options for paginating the results.
     */
    public static getAll(pageOptions: IPaginateOptions): PromiseLike<Project[]> {

        return Project
            .findAll({
                include: [Tag],
                order: [['name', 'ASC'], ['tags', 'key', 'DESC']],
                ...paginate(pageOptions)
            });

    }

    /**
     * Gets a single project.
     * @param id The project's id.
     */
    public static getOne(id: number): PromiseLike<Project> {

        return Project.findById(
            id,
            {
                include: [
                    Tag,
                    Team,
                    {
                        model: FileGroup,
                        include: [File]
                    }
                ]
            }
        );

    }

    /**
     * Creates a new project.
     * @param newProject The new project.
     */
    public static createOne(newProject: NewProject): PromiseLike<Project> {
        newProject = Object.assign(new NewProject(), newProject);
        return validate(newProject)
            .then(_ => {
                console.log(newProject);
                const { tagIds, ...newProjectProps } = newProject;
                return Project
                    .create(newProjectProps)
                    .then(project => project.$set('tags', tagIds)) as PromiseLike<Project>;
            });
    }

    /**
     * Edits a project.
     * @param id The project's id.
     * @param editProject The edited project.
     */
    public static editOne(id: number, editProject: Partial<NewProject>): PromiseLike<Project> {
        editProject = Object.assign(new NewProject(), editProject);
        return validate(editProject)
            .then(_ => {
                console.log(editProject);
                const { tagIds, ...editProjectProps } = editProject;
                return Project
                    .findById(id)
                    .then(project => (project as Project).update(editProjectProps))
                    .then(project => tagIds ? project.$set('tags', tagIds) : project) as PromiseLike<Project>;
            });
    }

    /**
     * Deletes a project.
     * @param id The project's id.
     */
    public static deleteOne(id: number): PromiseLike<void> {

        return Project.findById(id).then(project => (project as Project).destroy());

    }

    // ========================== //
    //       Route Handling       //
    // ========================== //

    /**
     * Project Index
     * Gets projects with their tags, paginated and sorted by name.
     *
     * Methods:
     *  - GET /
     *
     */
    @Get("/")
    public getProjects(@QueryParams() queryParams: IPaginateOptions) {
        return ProjectsJsonController.getAll(queryParams).then(projects => projects.map(p => ({
            id: p.id,
            name: p.name,
            shortDescription:  p.shortDescription,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            tags: p.tags.map(t => ({
                id: t.id,
                key: t.key,
                color: t.color,
            })),
        })));
    }

    /**
     * Project Details
     * Gets the details for a project.
     *
     * Methods:
     *  - GET /{id}
     *
     */
    @Get("/:id(\\d+)")
    public getProject(@Param('id') projectId: number) {
        return ProjectsJsonController.getOne(projectId).then(p => ({
            id: p.id,
            name: p.name,
            shortDescription:  p.shortDescription,
            description: p.description,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            team: {
                id: p.team.id,
                name: p.team.name,
                shortDescription: p.team.shortDescription,
            },
            tags: p.tags.map(t => ({
                id: t.id,
                key: t.key,
                color: t.color,
            })),
            fileGroups: p.fileGroups.map(fg => ({
                id: fg.id,
                title: fg.title,
            })),
        }));
    }

    /**
     * Create Project
     * Creates a new project.
     *
     * Methods:
     *  - POST /
     *
     */
    @Post("/")
    public createProject(
        @Body() body: NewProject,
        @QueryParams() query: NewProject
    ) {
        return ProjectsJsonController.createOne({...query, ...body});
    }

    /**
     * Update Project
     * Updates a project.
     *
     * Methods:
     *  - POST /{id}
     *  - PUT /{id}
     *  - PATCH /{id}
     *
     */
    @Post("/:id(\\d+)")
    @Put("/:id(\\d+)")
    @Patch("/:id(\\d+)")
    public updateProject(
        @Param('id') projectId: number,
        @Body() body: NewProject,
        @QueryParams() query: NewProject
    ) {
        return ProjectsJsonController.editOne(projectId, {...query, ...body});
    }

    /**
     * Delete Project
     * Deletes a project.
     *
     * Methods:
     *  - DELETE /{id}
     *  - POST /{id}/delete
     *
     */
    @Delete("/:id(\\d+)")
    @Post("/:id(\\d+)/delete")
    public deleteProject(@Param('id') projectId: number) {
        return ProjectsJsonController.deleteOne(projectId);
    }

}
