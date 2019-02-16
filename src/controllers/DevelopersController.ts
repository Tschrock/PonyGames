/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Router, Get, HttpError } from "../lib/cp3-express-decorators";
import { Request, Response, NextFunction } from "express";

import { paginate } from "../lib/FindHelper";

import { Developer } from "../models/Developer";
import { TeamMember } from "../models/TeamMember";
import { Team } from "../models/Team";

/** The Developer Controller */
export class DevelopersController extends Router {

    // ================= //
    //       Pages       //
    // ================= //

    /**
     * Developer Index Page
     * Shows Developers, paginated and sorted by name.
     */
    @Get("/")
    public async showAllDevelopers(req: Request, res: Response, next: NextFunction) {

        const developers = await Developer.findAll({
            include: [{ model: TeamMember, include: [Team] }],
            order: [['name', 'ASC']],
            ...paginate(req.query)
        });

        res.format({
            html: () => res.render('developers/index', { developers })
        });

    }

    /**
     * Project Developer Page
     * Shows the details for a Developer.
     */
    @Get("/:developerId(\\d+)")
    public async showDeveloper(req: Request, res: Response, next: NextFunction) {

        const developer = await Developer.findByPk(
            +req.params['developerId'],
            { include: [{ model: TeamMember, include: [Team] }]}
        );

        if (!developer) return next(new HttpError(404, "That Developer does not exist."));
        
        res.format({
            html: () => res.render('developers/details', { developer })
        });

    }

    /**
     * New Developer Page
     * Shows a form to create a new Developer.
     */
    @Get("/new")
    public newDeveloper(req: Request, res: Response, next: NextFunction) {

        if (!req.user) res.redirect('/login');
        if (!req.user.can('create', Developer)) return next(new HttpError(403, "You do not have permission to create a Developer."));

        res.format({
            html: () => res.render('developers/new')
        });

    }

    /**
     * Edit Developer Page
     * Shows a form to edit a Developer.
     */
    @Get("/:developerId(\\d+)/edit")
    public async editDeveloper(req: Request, res: Response, next: NextFunction) {

        if (!req.user) return res.redirect('/login');

        const developer = await Developer.findByPk( +req.params['developerId'] );
        
        if (!developer) return next(new HttpError(404, "That Developer does not exist."))
        if (!req.user.can('edit', developer)) return next(new HttpError(403, "You do not have permission to edit this Developer."));

        res.format({
            html: () => res.render('developers/edit', { developer })
        });

    }

}
