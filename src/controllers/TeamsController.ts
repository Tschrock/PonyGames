/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

// tslint:disable:prefer-function-over-method

import { Controller, Get, Render, QueryParams, Param } from "routing-controllers";

import { Team } from '../models/Team';

import { paginate, IPaginateOptions } from "../lib/FindHelper";
import TeamsJsonController from "./api/v1/TeamsJsonController";

/** The Team Controller */
@Controller()
export default class TeamsController {

    // ================= //
    //       Pages       //
    // ================= //

    /**
     * Teams Index Page
     * Shows teams, paginated and sorted by name.
     */
    @Get("/")
    @Render("teams/index")
    public showAllTeams(@QueryParams() queryParams: IPaginateOptions) {
        return TeamsJsonController.getAll(queryParams).then(teams => ({ teams }));
    }

    /**
     * Team Details Page
     * Shows the details for a Team.
     */
    @Get("/:id(\\d+)")
    @Render("teams/details")
    public showTeam(@Param('id') teamId: number) {
        return TeamsJsonController.getOne(teamId).then(team => ({ team }));
    }

    /**
     * New Team Page
     * Shows a form to create a new Team.
     */
    @Get("/new")
    @Render("teams/new")
    public newTeam() {
        return { };
    }

    /**
     * Edit Team Page
     * Shows a form to edit a Team.
     */
    @Get("/:id(\\d+)/edit")
    @Render("teams/edit")
    public editTeam(@Param('id') teamId: number) {
        return Team.findById(teamId, { include: []}).then(team => ({ team }));
    }


}
