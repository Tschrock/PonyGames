/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NotFound, Forbidden, BadRequest } from 'http-errors';

import { Controller, Router, Get, RenderJSON, RouteParam, QueryParam, Post, Patch, Put, Delete, RequireUser, ParseJson, ValidateCsrf, BodyParam, CurrentUser } from '../../../cp3-express';

import { Project, Image, Link, UserAccount } from '../../../models';
import { Request, Response, NextFunction } from 'express';

@Router("/api/v1/projects")
@RequireUser()
export class ProjectsApiV1Controller extends Controller<ProjectsApiV1Controller> {

    public static projectToJSON(project: Project) {
        return {
            Id: project.id,
            Guid: project.guid,
            Name: project.name,
            TeamName: project.teamName,
            Description: project.description,
            Images: project.images.map(image => ({
                Id: image.id,
                Guid: image.guid,
                Format: image.extension,
                Url: image.url,
                Size: image.size,
                Width: image.width,
                Height: image.height,
                CreatedAt: image.createdAt,
                UpdatedAt: image.updatedAt
            })),
            Links: project.links.map(link => ({
                Id: link.id,
                Url: link.url,
                Name: link.name,
                IconCssClass: link.iconCssClass,
                CreatedAt: link.createdAt,
                UpdatedAt: link.updatedAt
            })),
            Url: project.url,
            CreatedAt: project.createdAt,
            UpdatedAt: project.updatedAt,
        };
    }

    @Get("/")
    @RenderJSON()
    protected async getAllProjects(
        @QueryParam("offset") offset: number | null,
        @QueryParam("limit") limit: number | null
    ) {
        offset = offset || 0;
        limit = Math.min(100, limit || 50);

        const { count: Total, rows: Projects } = await Project.findAndCountAll({
            offset,
            limit,
            include: [Image, Link]
        });

        const Results = Projects.map(p => ProjectsApiV1Controller.projectToJSON(p));

        return { Results, Count: Results.length, Offset: offset, Limit: limit, Total };

    }

    @Get("/:id")
    @RenderJSON()
    protected async getProject(@RouteParam('id') projectId: number) {

        const project = await Project.findByPk(projectId, { include: [Image, Link] });

        if (!project) {
            throw new NotFound("That Project doesn't exist.");
        }

        return ProjectsApiV1Controller.projectToJSON(project);

    }

    @Post("/")
    @ParseJson()
    @ValidateCsrf()
    @RenderJSON()
    protected async createProject(
        @CurrentUser() currentUser: UserAccount,
        @BodyParam("Name") name: string,
        @BodyParam("TeamName") team_name: string,
        @BodyParam("Description") description: string,
    ) {

        if(!await currentUser.checkEntityPermission("create", Project)) {
            throw new Forbidden("You don't have permission to create a new Project.");
        }

        const newProject = Project.build({ name, team_name, description });

        try {
            await newProject.validate();
        }
        catch (validationErrors) {
            throw new BadRequest((validationErrors as Error).toString());
        }

        const savedProject = await newProject.save();

        return this.getProject(savedProject.id);

    }

    @Patch("/:id")
    @Put("/:id")
    @ParseJson()
    @ValidateCsrf()
    @RenderJSON()
    protected async updateProject(
        @RouteParam('id') projectId: number,
        @CurrentUser() currentUser: UserAccount,
        @BodyParam("Name") name: string,
        @BodyParam("TeamName") team_name: string,
        @BodyParam("Description") description: string,
    ) {

        const project = await Project.findByPk(projectId);

        if(!project) {
            throw new NotFound("That Project doesn't exist.");
        }

        if(!await project.checkUserPermission(currentUser, "edit")) {
            throw new Forbidden("You don't have permission to edit this Project.");
        }

        if(name) project.name = name;
        if(team_name) project.teamName = team_name;
        if(description) project.description = description;

        try {
            await project.validate();
        }
        catch (validationErrors) {
            throw new BadRequest((validationErrors as Error).toString());
        }

        const savedProject = await project.save();

        return this.getProject(savedProject.id);

    }

    @Delete("/:id")
    @RenderJSON()
    protected async deleteProject() {
        //
    }

    @Post("/:projectId/images")
    @ParseJson()
    @ValidateCsrf()
    @RenderJSON()
    protected async createProjectImage() {
        //
    }

    @Delete("/:projectId/images/:imageId")
    @RenderJSON()
    protected async deleteProjectImage() {
        //
    }

    @Post("/:projectId/images")
    @ParseJson()
    @ValidateCsrf()
    @RenderJSON()
    protected async createProjectLink() {
        //
    }

    @Patch("/:id")
    @Put("/:id")
    @ParseJson()
    @ValidateCsrf()
    @RenderJSON()
    protected async updateProjectLink(req: Request, res: Response, next: NextFunction) {
        //
    }

    @Delete("/:projectId/images/:imageId")
    @RenderJSON()
    protected async deleteProjectLink() {
        //
    }

}
