/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Router, Get, HttpError } from "cp3-express-decorators";
import { Request, Response, NextFunction } from "express";

import { paginate } from "../lib/FindHelper";

import { Team } from '../models/Team';
import { TeamMember } from "../models/TeamMember";
import { Developer } from "../models/Developer";
import { Project } from "../models/Project";

/** The Teams Controller */
export class TeamsController extends Router {

    /**
     * Teams Index Page
     * Shows a list of Teams.
     */
    @Get("/")
    public async getTeamsIndex(req: Request, res: Response, next: NextFunction) {

        const teams = await Team.findAll({
            include: [Project, { model: TeamMember, include: [Developer] }],
            order: [['name', 'ASC']],
            ...paginate(req.query)
        });
        
        res.format({
            html: () => res.render('teams/index', { teams })
        });

    }

    /**
     * Team Details Page
     * Shows details about a Team.
     */
    @Get("/:teamId(\\d+)")
    public async getTeamDetail(req: Request, res: Response, next: NextFunction) {

        const team = await Team.findById(
            +req.params['teamId'],
            { include: [Project, { model: TeamMember, include: [Developer] }] }
        );

        if (!team) return next(new HttpError(404, "That Team does not exist."));
        
        res.format({
            html: () => res.render('teams/details', { team })
        });

    }

    /**
     * New Team Page
     * Shows a form to create a Team.
     */
    @Get("/new")
    public async getNewTeam(req: Request, res: Response, next: NextFunction) {
    
        if (!req.user) res.redirect('/login');
        if (!req.user.can('create', Team)) return next(new HttpError(403, "You do not have permission to create a Team."));

        res.format({
            html: () => res.render('teams/new')
        });
    
    }

    /**
     * Edit Team Page
     * Shows a form to edit a Team.
     */
    @Get("/:teamId(\\d+)/edit")
    public async getEditTeam(req: Request, res: Response, next: NextFunction) {
        
        if (!req.user) return res.redirect('/login');

        const team = await Team.findById( +req.params['teamId'] );
        
        if (!team) return next(new HttpError(404, "That Team does not exist."));
        if (!req.user.can('edit', team)) return next(new HttpError(403, "You do not have permission to edit this Team."));

        res.format({
            html: () => res.render('teams/edit', { team })
        });

    }

}
