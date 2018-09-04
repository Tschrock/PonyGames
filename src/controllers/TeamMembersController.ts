/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

// tslint:disable:prefer-function-over-method

import { Controller, Get, Render, QueryParams, Param, Params } from "routing-controllers";

import { validate } from "../lib/ValidationHelper";

import { NewTeamMember } from "./api/v1/params/NewTeamMember";
import TeamMembersJsonController from "./api/v1/TeamMembersJsonController";
import { Team } from "../models/Team";
import { Developer } from "../models/Developer";

/** The TeamMember Controller */
@Controller()
export default class TeamMemberController {

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
    @Render("teamMembers/new")
    public async newTeamMember(
        @Params() route: NewTeamMember,
        @QueryParams() query: NewTeamMember,
    ) {
        const prefillPars = Object.assign(new NewTeamMember(), { ...route, ...query });

        // Get and return all available teams and developers.
        return Promise
            .all([
                Team.findAll(),
                Developer.findAll(),
                validate(prefillPars).then(_ => prefillPars, e => ({})),
            ])
            .then(([teams, developers, prefill]) => ({ teams, developers, prefill}));

    }

    /**
     * Edit TeamMember Page
     * Shows a form to edit a TeamMember.
     */
    @Get("/:id(\\d+)/edit")
    @Render("teamMembers/edit")
    public async editTeamMember(@Param('id') teamMemberId: number) {

        return Promise
            .all([
                TeamMembersJsonController.getOne(teamMemberId),
                Team.findAll(),
                Developer.findAll(),
            ])
            .then(([teammember, teams, developers]) => ({ teammember, teams, developers }));

    }

}
