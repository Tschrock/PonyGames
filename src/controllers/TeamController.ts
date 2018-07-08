/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

// tslint:disable:prefer-function-over-method

import { Controller, Get, Render, QueryParams, Param, Post, Delete, Put, Patch } from "routing-controllers";

import { Team } from '../models/Team';
import { TeamDeveloper } from "../models/TeamDeveloper";
import { Developer } from "../models/Developer";
import { Project } from "../models/Project";
import { ProjectTag } from "../models/ProjectTag";

import { paginate, IPaginateOptions } from "../lib/FindHelper";
import { Tag } from "../models/Tag";

/** The Team Controller */
@Controller()
class TeamController {

    /**
     * Pages
     */

    /** Gets the index page. */
    @Get("/")
    @Render("teams/index")
    public showAllTeams(@QueryParams() queryParams: IPaginateOptions) {
        return Team
            .findAll({
                include: [],
                order: [['name', 'ASC']],
                ...paginate(queryParams)
            })
            .then(teams => ({ teams }));
    }

    /** Gets the Team details page. */
    @Get("/:id(\\d+)")
    @Render("teams/details")
    public showTeam(@Param('id') teamId: number) {
        return Team.findById(teamId, { include: [ { model:TeamDeveloper, include: [Developer]}, { model:Project, include: [Tag] } ]}).then(team => ({ team }));
    }

    /** Gets the new Team page. */
    @Get("/new")
    @Render("teams/new")
    public newTeam() {
        return { };
    }

    /** Gets the edit Team page. */
    @Get("/:id(\\d+)/edit")
    @Render("teams/edit")
    public editTeam(@Param('id') teamId: number) {
        return Team.findById(teamId, { include: []}).then(team => ({ team }));
    }

    /**
     * Handlers
     */

    /** Creates a Team. */
    @Post("/")
    public createTeam() {
        return { };
    }

    /** Updates a Team. */
    @Put("/:id(\\d+)")
    @Patch("/:id(\\d+)")
    public updateTeam(@Param('id') teamId: number) {
        return Team.findById(teamId, { include: []}).then(team => ({ team }));
    }

    /** Deletes a Team. */
    @Delete("/:id(\\d+)")
    @Render("teams/details")
    public deleteTeam(@Param('id') teamId: number) {
        return Team.findById(teamId).then(team => {
            if(team) team.destroy();
        });
    }

}

export = TeamController;
