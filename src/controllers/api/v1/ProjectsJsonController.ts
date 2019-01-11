/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { Router, Get, Post, Delete, Put, Patch, HttpError, ParseJson, ValidateCsrf } from "cp3-express-decorators";
import { Request, Response, NextFunction } from "express";

import { paginate } from "../../../lib/FindHelper";
import { validate } from "../../../lib/ValidationHelper";

import { Project } from "../../../models/Project";
import { Tag } from "../../../models/Tag";
import { FileGroup } from "../../../models/FileGroup";
import { File } from "../../../models/File";
import { Team } from "../../../models/Team";

import { NewProject } from "./params/NewProject";

import { TeamsJsonController } from "./TeamsJsonController";
import { TeamMembersJsonController } from "./TeamMembersJsonController";

/**
 * The controller for the v1 Projects API.
 */
export class ProjectsJsonController extends Router {

    // ========================== //
    //      JSON Formatting       //
    // ========================== //

    public static getShortJsonObject(project: Project) {
        return {
            id: project.id,
            name: project.name,
            summary: project.summary,
        };
    }

    public static getMediumJsonObject(project: Project) {
        return {
            id: project.id,
            name: project.name,
            summary: project.summary,
            tags: project.tags ? project.tags.map(t => ({
                id: t.id,
                key: t.key,
                color: t.color,
            })) : [],
        };
    }

    public static getFullJsonObject(project: Project) {
        return {
            id: project.id,
            name: project.name,
            summary: project.summary,
            description: project.description,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            team: project.team ? TeamsJsonController.getShortJsonObject(project.team) : null,
            tags: project.tags ? project.tags.map(t => ({
                id: t.id,
                key: t.key,
                color: t.color,
            })) : [],
            fileGroups: project.fileGroups ? project.fileGroups.map(fg => ({
                id: fg.id,
                title: fg.title,
            })) : [],
        };
    }

    // ============================== //
    //       Controller Methods       //
    // ============================== //

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
    public async getProjects(req: Request, res: Response, next: NextFunction) {

        const projects = await Project.findAll({
            include: [Tag],
            order: [['name', 'ASC'], ['tags', 'key', 'DESC']],
            ...paginate(req.query)
        });

        const projectsJSON = projects.map(ProjectsJsonController.getMediumJsonObject);

        res.format({
            json: () => res.json(projectsJSON)
        });

    }

    /**
     * Project Details
     * Gets the details for a project.
     *
     * Methods:
     *  - GET /{id}
     *
     */
    @Get("/:projectId(\\d+)")
    public async getProject(req: Request, res: Response, next: NextFunction) {

        const project = await Project.findById(
            +req.params['projectId'],
            { include: [Tag, Team, { model: FileGroup, include: [File] }] }
        );

        if (!project) return next(new HttpError(404, "That Project does not exist."));

        const projectJSON = ProjectsJsonController.getFullJsonObject(project);

        res.format({
            json: () => res.json(projectJSON)
        });

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
    @ParseJson()
    @ValidateCsrf()
    public async createProject(req: Request, res: Response, next: NextFunction) {

        if (!req.user) return next(new HttpError(401, "Unauthorized"));
        if (!req.user.can('create', Project)) return next(new HttpError(403, "You do not have permission to create a Project."));

        const newProjectData = Object.assign(new NewProject(), req.body);

        await validate(newProjectData);

        const { tagIds, ...newProject } = newProjectData;
        const project = await Project.create({ ...newProject }, { include: [Tag] });
        const taggedProject = await project.$set("tagIds", tagIds);

        const projectJSON = ProjectsJsonController.getFullJsonObject(taggedProject);

        res.format({
            json: () => res.json(projectJSON)
        });

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
    @Post("/:projectId(\\d+)")
    @Put("/:projectId(\\d+)")
    @Patch("/:projectId(\\d+)")
    @ParseJson()
    @ValidateCsrf()
    public async updateProject(req: Request, res: Response, next: NextFunction) {

        if (!req.user) return next(new HttpError(401, "Unauthorized"));

        const project = await Project.findById(+req.params['projectId']);

        if (!project) return next(new HttpError(404, "That Project does not exist."));
        if (!req.user.can('edit', Project)) return next(new HttpError(403, "You do not have permission to edit this Project."));

        const newProjectData = Object.assign(new NewProject(), req.body);

        await validate(newProjectData);

        const { tagIds, ...newProject } = newProjectData;

        const editedProject = await project.update({ ...newProject });
        const editedProject2 = await editedProject.$set("tagIds", tagIds);

        const projectJSON = ProjectsJsonController.getFullJsonObject(editedProject2);
        res.format({
            json: () => res.json(projectJSON)
        });

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
    @Delete("/:projectId(\\d+)")
    @Post("/:projectId(\\d+)/delete")
    @ParseJson()
    @ValidateCsrf()
    public async deleteProject(req: Request, res: Response, next: NextFunction) {


        if (!req.user) return next(new HttpError(401, "Unauthorized"));

        const project = await Project.findById(+req.params['projectId']);

        if (!project) return next(new HttpError(404, "That Project does not exist."));
        if (!req.user.can('edit', Project)) return next(new HttpError(403, "You do not have permission to edit this Project."));

        await project.destroy();

        res.status(204).send();

    }

}
