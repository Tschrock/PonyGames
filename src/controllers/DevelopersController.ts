/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

// tslint:disable:prefer-function-over-method

import { Controller, Get, Render, QueryParams, Param, Post, Delete, Put, Patch } from "routing-controllers";

import { Developer } from '../models/Developer';

import { paginate, IPaginateOptions } from "../lib/FindHelper";
import { Team } from "../models/Team";
import { TeamMember } from "../models/TeamMember";

/** The Developer Controller */
@Controller()
class DeveloperController {

    /**
     * Pages
     */

    /** Gets the index page. */
    @Get("/")
    @Render("developers/index")
    public showAllDevelopers(@QueryParams() queryParams: IPaginateOptions) {
        return Developer
            .findAll({
                include: [{ model:TeamMember, include:[Team] }],
                order: [['name', 'ASC']],
                ...paginate(queryParams)
            })
            .then(developers => ({ developers }));
    }

    /** Gets the Developer details page. */
    @Get("/:id(\\d+)")
    @Render("developers/details")
    public showDeveloper(@Param('id') developerId: number) {
        return Developer.findById(developerId, { include: [{ model:TeamMember, include:[Team] }] }).then(developer => ({ developer }));
    }

    /** Gets the new Developer page. */
    @Get("/new")
    @Render("developers/new")
    public newDeveloper() {
        return { };
    }

    /** Gets the edit Developer page. */
    @Get("/:id(\\d+)/edit")
    @Render("developers/edit")
    public editDeveloper(@Param('id') developerId: number) {
        return Developer.findById(developerId, { include: [{ model:TeamMember, include:[Team] }] }).then(developer => ({ developer }));
    }

    /**
     * Handlers
     */

    /** Creates a Developer. */
    @Post("/")
    public createDeveloper() {
        return { };
    }

    /** Updates a Developer. */
    @Put("/:id(\\d+)")
    @Patch("/:id(\\d+)")
    public updateDeveloper(@Param('id') developerId: number) {
        return Developer.findById(developerId, { include: [{ model:TeamMember, include:[Team] }] }).then(developer => ({ developer }));
    }

    /** Deletes a Developer. */
    @Delete("/:id(\\d+)")
    @Render("developers/details")
    public deleteDeveloper(@Param('id') developerId: number) {
        return Developer.findById(developerId).then(developer => {
            if(developer) developer.destroy();
        });
    }

}

export = DeveloperController;
