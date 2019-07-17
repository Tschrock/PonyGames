/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { NotFound } from 'http-errors';

import {Controller, Router, Get, Render, RouteParam } from '../cp3-express';

import { Image } from '../models/Image';
import { Link } from '../models/Link';
import { Project } from '../models/Project';

@Router("/projects")
export class ProjectsController extends Controller<ProjectsController> {

    @Get("/")
    @Render("projects/index")
    protected async getAllProjects() {

        const Projects = await Project.findAll({ include: [ Image, Link ] });

        return { Projects };

    }

    @Get("/:id")
    @Render("projects/view")
    protected async getProject(@RouteParam('id') projectId: number) {

        const project = await Project.findByPk(projectId, { include: [ Image, Link ] });

        if (project) return { Project: project };
        else throw new NotFound("That Project doesn't exist.");

    }

}
