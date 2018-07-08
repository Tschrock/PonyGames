/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
'use strict';

// tslint:disable:prefer-function-over-method

import { JsonController, Get, QueryParams, Param, Post, Delete, Put, Patch, Body, UseBefore, UseAfter } from "routing-controllers";

import { IPaginateOptions, paginate } from "../../../lib/FindHelper";
import { Project } from "../../../models/Project";
import { Tag } from "../../../models/Tag";
import { File } from "../../../models/File";
import { FileGroup } from "../../../models/FileGroup";
import { Team } from "../../../models/Team";
import { NewProject } from "./params/NewProject";
import { formParser } from "../../../app/Express";
import { JsonErrorHandler } from "./JsonErrorHandler";
import { validate } from "../../../lib/ValidationHelper";

/** ProjectJsonController */
@JsonController()
@UseAfter(JsonErrorHandler)
export default class ProjectJsonController {

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
                const { tags, ...newProjectProps } = newProject;
                return Project
                    .create(newProjectProps)
                    .then(project => project.$set('tags', tags)) as PromiseLike<Project>;
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
                const { tags, ...editProjectProps } = editProject;
                return Project
                    .findById(id)
                    .then(project => (project as Project).update(editProjectProps))
                    .then(project => tags ? project.$set('tags', tags) : project) as PromiseLike<Project>;
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
     */
    @Get("/")
    public getProjects(@QueryParams() queryParams: IPaginateOptions) {
        return ProjectJsonController.getAll(queryParams);
    }

    /**
     * Project Details
     * Gets the details for a project.
     */
    @Get("/:id(\\d+)")
    public getProject(@Param('id') projectId: number) {
        return ProjectJsonController.getOne(projectId);
    }

    /**
     * Create Project
     * Creates a new project.
     */
    @Post("/")
    @UseBefore(formParser.none())
    public createProject(
        @Body({ required: true }) newProject: NewProject
    ) {
        return ProjectJsonController.createOne(newProject);
    }

    /**
     * Update Project
     * Updates a project.
     */
    @Put("/:id(\\d+)")
    @Patch("/:id(\\d+)")
    @UseBefore(formParser.none())
    public updateProject(
        @Param('id') projectId: number,
        @Body({ required: true }) newProject: NewProject
    ) {
        console.log(newProject);
        return ProjectJsonController.editOne(projectId, newProject);
    }

    /**
     * Delete Project
     * Deletes a project.
     */
    @Delete("/:id(\\d+)")
    public deleteProject(@Param('id') projectId: number) {
        return ProjectJsonController.deleteOne(projectId);
    }

}
