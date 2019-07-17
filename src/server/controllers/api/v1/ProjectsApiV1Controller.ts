/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NotFound } from 'http-errors';

import { Controller, Router, Get, RenderJSON, RouteParam, QueryParam, Post, Patch, Put, Delete, RequireUser, ParseJson, ValidateCsrf, BodyParam } from '../../../cp3-express';

import { Project, Image, Link, UserAccount } from '../../../models';
import { Request, Response, NextFunction } from 'express';

@Router("/api/v1/projects")
@RequireUser()
export class ProjectsApiV1Controller extends Controller<ProjectsApiV1Controller> {

    protected projectToJSON(project: Project) {
        return {
            Id: project.id,
            Name: project.name,
            TeamName: project.team_name,
            CreatedAt: project.createdAt,
            UpdatedAt: project.updatedAt,
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
                IconCssClass: link.icon_css_class,
                CreatedAt: link.createdAt,
                UpdatedAt: link.updatedAt
            }))
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

        const Results = Projects.map(p => this.projectToJSON(p));

        return { Results, Count: Results.length, Offset: offset, Limit: limit, Total };

    }

    @Get("/:id")
    @RenderJSON()
    protected async getProject(@RouteParam('id') projectId: number) {

        const project = await Project.findByPk(projectId, { include: [Image, Link] });

        if (project) return this.projectToJSON(project);
        else throw new NotFound("That Project doesn't exist.");

    }

    @Post("/")
    @ParseJson()
    @ValidateCsrf()
    @RenderJSON()
    protected async createProject(
        @CurrentUser currentUser: UserAccount,
        @BodyParam("Name") name: string,
        @BodyParam("TeamName") team_name: string,
        @BodyParam("Description") description: string,
    ) {
        if(currentUser.hasPermission<Project>("create", Project)) {

        }
    }

    @Patch("/:id")
    @Put("/:id")
    @ParseJson()
    @ValidateCsrf()
    @RenderJSON()
    protected async updateProject(req: Request, res: Response, next: NextFunction) {

    }

    @Delete("/:id")
    @RenderJSON()
    protected async deleteProject() {

    }

    @Post("/:projectId/images")
    @ParseJson()
    @ValidateCsrf()
    @RenderJSON()
    protected async createProjectImage() {

    }

    @Delete("/:projectId/images/:imageId")
    @RenderJSON()
    protected async deleteProjectImage() {

    }

    @Post("/:projectId/images")
    @ParseJson()
    @ValidateCsrf()
    @RenderJSON()
    protected async createProjectLink() {

    }

    @Patch("/:id")
    @Put("/:id")
    @ParseJson()
    @ValidateCsrf()
    @RenderJSON()
    protected async updateProjectLink(req: Request, res: Response, next: NextFunction) {

    }

    @Delete("/:projectId/images/:imageId")
    @RenderJSON()
    protected async deleteProjectLink() {

    }

}
