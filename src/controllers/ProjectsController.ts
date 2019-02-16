/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Router, Get, HttpError } from "../lib/cp3-express-decorators";
import { Request, Response, NextFunction } from "express";

import { paginate } from "../lib/FindHelper";

import { Project } from '../models/Project';
import { Tag } from '../models/Tag';
import { Team } from "../models/Team";
import { FileGroup } from "../models/FileGroup";
import { File } from "../models/File";

/** The Project Controller */
export class ProjectsController extends Router {

    // ================= //
    //       Pages       //
    // ================= //

    /**
     * Project Index Page
     * Shows projects with their tags, paginated and sorted by name.
     */
    @Get("/")
    public async showAllProjects(req: Request, res: Response, next: NextFunction) {

        const projects = await Project.findAll({
            include: [Tag],
            order: [['name', 'ASC'], ['tags', 'key', 'DESC']],
            ...paginate(req.query)
        });

        res.format({
            html: () => res.render('projects/index', { projects })
        });

    }

    /**
     * Project Details Page
     * Shows the details for a project.
     */
    @Get("/:projectId(\\d+)")
    public async showProject(req: Request, res: Response, next: NextFunction) {

        const project = await Project.findByPk(
            +req.params['projectId'],
            { include: [Tag, Team, { model: FileGroup, include: [File] }] }
        );

        if (!project) return next(new HttpError(404, "That Project does not exist."));

        res.format({
            html: () => res.render('projects/details', { project })
        });

    }

    /**
     * New Project Page
     * Shows a form to create a new project.
     */
    @Get("/new")
    public async newProject(req: Request, res: Response, next: NextFunction) {

        if (!req.user) res.redirect('/login');
        if (!req.user.can('create', Project)) return next(new HttpError(403, "You do not have permission to create a Project."));

        var project: Project | null = null;
        if("copy" in req.query) {
            try {
                project = await Project.findByPk(+req.query["copy"], { include: [Tag, Team] });
            }
            catch(e) {
                // noop
            }
        }
        if(project === null) project = new Project();

        const [teams, tags] = await Promise.all([
            Team.findAll(),
            Tag.findAll()
        ]);

        res.format({
            html: () => res.render('projects/new', { teams, tags, project })
        });

    }

    /**
     * Edit Project Page
     * Shows a form to edit a project.
     */
    @Get("/:projectId(\\d+)/edit")
    public async editProject(req: Request, res: Response, next: NextFunction) {
        
        if (!req.user) return res.redirect('/login');

        const [project, teams, tags] = await Promise.all([
            Project.findByPk(+req.params['projectId'], { include: [Tag, Team] }),
            Team.findAll(),
            Tag.findAll()
        ]);
        
        if (!project) return next(new HttpError(404, "That Project does not exist."))
        if (!req.user.can('edit', project)) return next(new HttpError(403, "You do not have permission to edit this Project."));

        res.format({
            html: () => res.render('projects/edit', { project, teams, tags })
        });

    }

}
