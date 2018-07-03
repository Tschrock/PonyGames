/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
'use strict';

// tslint:disable:prefer-function-over-method

import { Controller, Get, Render, QueryParams, Param, Post, Delete, Put, Patch, Body, Redirect } from "routing-controllers";

import { Project } from '../models/Project';
import { Tag } from '../models/Tag';

import { paginate, IPagenateQuery } from "../lib/FindHelpers";
import { Team } from "../models/Team";

/** The Project Controller */
@Controller()
class ProjectController {

    /**
     * Pages
     */

    /** Gets the index page. */
    @Get("/")
    @Render("projects/index")
    public showAllProjects(@QueryParams() queryParams: IPagenateQuery) {
        return Project
            .findAll({
                include: [Tag],
                order: [['name', 'ASC'], ['tags', 'key', 'DESC']],
                ...paginate(queryParams)
            })
            .then(projects => ({ projects }));
    }

    /** Gets the project details page. */
    @Get("/:id(\\d+)")
    @Render("projects/details")
    public showProject(@Param('id') projectId: number) {
        return Project.findById(projectId, { include: [Tag, Team] }).then(project => ({ project }));
    }

    /** Gets the new project page. */
    @Get("/new")
    @Render("projects/new")
    public newProject() {
        return {};
    }

    /** Gets the edit project page. */
    @Get("/:id(\\d+)/edit")
    @Render("projects/edit")
    public async editProject(@Param('id') projectId: number) {
        return Promise.all([
            Project.findById(projectId, { include: [Tag, Team] }),
            Team.findAll({}),
            Tag.findAll({})
        ]).then(([project, teams, tags]) => ({ project, teams, tags }));
    }

    /**
     * Handlers
     */

    /** Creates a project. */
    @Post("/")
    public createProject() {
        return {};
    }

    /** Updates a project. */
    @Put("/:id(\\d+)")
    @Patch("/:id(\\d+)")
    @Redirect(":location")
    public async updateProject(
        @Param('id')
        projectId: number,
        @Body({ required: true, validate: true })
        { name, shortDescription, description, teamId, tags }: Project
    ) {

        return Project
            .findById(projectId)
            .then(project => (project ? Promise.all([
                project.update({ name, shortDescription, description, teamId }),
                project.$set('tags', tags)
            ]) : Promise.reject(new Error("Project Not Found"))))
            .then(
                success => ({ location: `/projects/${projectId}` }),
                fail => ({ location: `/projects/${projectId}/edit` })
            );

    }

    /** Deletes a project. */
    @Delete("/:id(\\d+)")
    @Render("projects/details")
    public deleteProject(@Param('id') projectId: number) {
        return Project.findById(projectId).then(project => {
            if (project) project.destroy();
        });
    }

}

export = ProjectController;
