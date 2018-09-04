/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

// tslint:disable:prefer-function-over-method

import { Controller, Get, Render, QueryParams, Param, Post, Delete, Put, Patch } from "routing-controllers";

import { Developer } from '../models/Developer';

import { IPaginateOptions } from "../lib/FindHelper";
import { Team } from "../models/Team";
import { TeamMember } from "../models/TeamMember";
import DevelopersJsonController from "./api/v1/DevelopersJsonController";

/** The Developer Controller */
@Controller()
export default class DeveloperController {

    // ================= //
    //       Pages       //
    // ================= //

    /**
     * Developer Index Page
     * Shows Developers, paginated and sorted by name.
     */
    @Get("/")
    @Render("developers/index")
    public async showAllDevelopers(@QueryParams() queryParams: IPaginateOptions) {
        return DevelopersJsonController.getAll(queryParams).then(developers => ({ developers }));
    }

    /**
     * Project Developer Page
     * Shows the details for a Developer.
     */
    @Get("/:id(\\d+)")
    @Render("developers/details")
    public async showDeveloper(@Param('id') developerId: number) {
        return DevelopersJsonController.getOne(developerId).then(developer => ({ developer }));
    }

    /**
     * New Developer Page
     * Shows a form to create a new Developer.
     */
    @Get("/new")
    @Render("developers/new")
    public newDeveloper() {
        return { };
    }

    /**
     * Edit Developer Page
     * Shows a form to edit a Developer.
     */
    @Get("/:id(\\d+)/edit")
    @Render("developers/edit")
    public async editDeveloper(@Param('id') developerId: number) {
        return DevelopersJsonController.getOne(developerId).then(developer => ({ developer }));
    }

}
