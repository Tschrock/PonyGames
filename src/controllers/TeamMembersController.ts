/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Router, Get, HttpError } from "../lib/cp3-express-decorators";
import { Request, Response, NextFunction } from "express";

import { validate } from "../lib/ValidationHelper";

import { NewTeamMember } from "./api/v1/params/NewTeamMember";
import { Team } from "../models/Team";
import { Developer } from "../models/Developer";
import { TeamMember } from "../models/TeamMember";

/** The TeamMember Controller */
export class TeamMemberController extends Router {

    // ================= //
    //       Pages       //
    // ================= //

    /**
     * No index page
     */

    /**
     * No details page
     */

    /**
     * New TeamMember Page
     * Shows a form to create a new TeamMember.
     */
    @Get("/new")
    public async getNewTeamMember(req: Request, res: Response, next: NextFunction) {

        if (!req.user) res.redirect('/login');
        if (!req.user.can('create', TeamMember)) return next(new HttpError(403, "You do not have permission to create a TeamMember."));

        const prefillPars = Object.assign(new NewTeamMember(), { ...req.params, ...req.query });

        const [teams, developers, prefill] = await Promise.all([
            Team.findAll(),
            Developer.findAll(),
            validate(prefillPars).then(_ => prefillPars, e => ({})),
        ]);

        res.format({
            html: () => res.render('teamMembers/new', { teams, developers, prefill })
        });

    }

    /**
     * Edit TeamMember Page
     * Shows a form to edit a TeamMember.
     */
    @Get("/:teamMemberId(\\d+)/edit")
    public async editTeamMember(req: Request, res: Response, next: NextFunction) {

        if (!req.user) return res.redirect('/login');

        const [teammember, teams, developers] = await Promise.all([
            TeamMember.findById(+req.params["teamMemberId"]),
            Team.findAll(),
            Developer.findAll(),
        ]);

        if (!teammember) return next(new HttpError(404, "That Team Member does not exist."))
        if (!req.user.can('edit', teammember)) return next(new HttpError(403, "You do not have permission to edit this Team Member."));

        res.format({
            html: () => res.render('teammembers/edit', { teammember, teams, developers })
        });

    }

}
