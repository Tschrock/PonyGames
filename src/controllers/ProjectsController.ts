/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

// tslint:disable:prefer-function-over-method

import { Controller, Get, Render, QueryParams, Param } from "routing-controllers";

import { Project } from '../models/Project';
import { Tag } from '../models/Tag';

import { IPaginateOptions } from "../lib/FindHelper";
import { Team } from "../models/Team";
import ProjectsJsonController from "./api/v1/ProjectsJsonController";

/** The Project Controller */
@Controller()
export default class ProjectsController {

    // ================= //
    //       Pages       //
    // ================= //

    /**
     * Project Index Page
     * Shows projects with their tags, paginated and sorted by name.
     */
    @Get("/")
    @Render("projects/index")
    public async showAllProjects(@QueryParams() queryParams: IPaginateOptions) {

        return ProjectsJsonController.getAll(queryParams).then(projects => ({ projects }));

    }

    /**
     * Project Details Page
     * Shows the details for a project.
     */
    @Get("/:id(\\d+)")
    @Render("projects/details")
    public async showProject(@Param('id') projectId: number) {

        return ProjectsJsonController.getOne(projectId).then(project => ({ project }));

    }

    /**
     * New Project Page
     * Shows a form to create a new project.
     */
    @Get("/new")
    @Render("projects/new")
    public async newProject() {

        // Get and return all available teams and tags.
        return Promise
            .all([
                Team.findAll(),
                Tag.findAll()
            ])
            .then(([teams, tags]) => ({ teams, tags }));

    }

    /**
     * Edit Project Page
     * Shows a form to edit a project.
     */
    @Get("/:id(\\d+)/edit")
    @Render("projects/edit")
    public async editProject(@Param('id') projectId: number) {

        // Get and return the specified project and all available teams and tags.
        return Promise
            .all([
                Project.findById(projectId, { include: [Tag, Team] }),
                Team.findAll(),
                Tag.findAll()
            ])
            .then(([project, teams, tags]) => ({ project, teams, tags }));

    }

}
