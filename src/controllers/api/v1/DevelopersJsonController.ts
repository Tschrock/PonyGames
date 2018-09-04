/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
'use strict';

// tslint:disable:prefer-function-over-method

import { JsonController, Get, QueryParams, Param, Post, Delete, Put, Patch, Body, UseAfter } from "routing-controllers";

import { IPaginateOptions, paginate } from "../../../lib/FindHelper";
import { validate } from "../../../lib/ValidationHelper";

import { Developer } from "../../../models/Developer";
import { TeamMember } from "../../../models/TeamMember";
import { Team } from "../../../models/Team";

import { NewDeveloper } from "./params/NewDeveloper";
import { JsonErrorHandler } from "./JsonErrorHandler";

/** DevelopersJsonController */
@JsonController()
@UseAfter(JsonErrorHandler)
export default class DevelopersJsonController {

    // ============================== //
    //       Controller Methods       //
    // ============================== //

    /**
     * Gets all developers.
     * @param pageOptions Options for paginating the results.
     */
    public static getAll(pageOptions: IPaginateOptions): PromiseLike<Developer[]> {

        return Developer
            .findAll({
                include: [{ model:TeamMember, include:[Team] }],
                order: [['name', 'ASC']],
                ...paginate(pageOptions)
            });

    }

    /**
     * Gets a single developer.
     * @param id The developer's id.
     */
    public static getOne(id: number): PromiseLike<Developer> {

        return Developer.findById(
            id,
            {
                include: [{ model:TeamMember, include:[Team] }]
            }
        );

    }

    /**
     * Creates a new developer.
     * @param newDeveloper The new developer.
     */
    public static createOne(newDeveloper: NewDeveloper): PromiseLike<Developer> {
        newDeveloper = Object.assign(new NewDeveloper(), newDeveloper);
        return validate(newDeveloper)
            .then(_ => {
                console.log(newDeveloper);
                const { ...newDeveloperProps } = newDeveloper;
                return Developer
                    .create(newDeveloperProps) as PromiseLike<Developer>;
            });
    }

    /**
     * Edits a developer.
     * @param id The developer's id.
     * @param editDeveloper The edited developer.
     */
    public static editOne(id: number, editDeveloper: Partial<NewDeveloper>): PromiseLike<Developer> {
        editDeveloper = Object.assign(new NewDeveloper(), editDeveloper);
        return validate(editDeveloper)
            .then(_ => {
                console.log(editDeveloper);
                const { ...editDeveloperProps } = editDeveloper;
                return Developer
                    .findById(id)
                    .then(developer => (developer as Developer).update(editDeveloperProps)) as PromiseLike<Developer>;
            });
    }

    /**
     * Deletes a developer.
     * @param id The developer's id.
     */
    public static deleteOne(id: number): PromiseLike<void> {

        return Developer.findById(id).then(developer => (developer as Developer).destroy());

    }

    // ========================== //
    //       Route Handling       //
    // ========================== //

    /**
     * Developer Index
     * Gets developers with their tags, paginated and sorted by name.
     *
     * Methods:
     *  - GET /
     *
     */
    @Get("/")
    public getDevelopers(@QueryParams() queryParams: IPaginateOptions) {
        return DevelopersJsonController.getAll(queryParams).then(developers => developers.map(p => ({
            id: p.id,
            name: p.name,
            shortDescription:  p.shortDescription,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            teamMemberships: p.teamMemberships.map(tm => ({
                id: tm.id,
                roles: tm.roles,
                team: {
                    id: tm.team.id,
                    name: tm.team.name,
                    shortDescription: tm.team.shortDescription,
                },
            })),
        })));
    }

    /**
     * Developer Details
     * Gets the details for a developer.
     *
     * Methods:
     *  - GET /{id}
     *
     */
    @Get("/:id(\\d+)")
    public getDeveloper(@Param('id') developerId: number) {
        return DevelopersJsonController.getOne(developerId).then(p => ({
            id: p.id,
            name: p.name,
            shortDescription:  p.shortDescription,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            teamMemberships: p.teamMemberships.map(tm => ({
                id: tm.id,
                roles: tm.roles,
                createdAt: tm.createdAt,
                updatedAt: tm.updatedAt,
                team: {
                    id: tm.team.id,
                    name: tm.team.name,
                    shortDescription: tm.team.shortDescription,
                },
            })),
        }));
    }

    /**
     * Create Developer
     * Creates a new developer.
     *
     * Methods:
     *  - POST /
     *
     */
    @Post("/")
    public createDeveloper(
        @Body() body: NewDeveloper,
        @QueryParams() query: NewDeveloper
    ) {
        return DevelopersJsonController.createOne({...query, ...body});
    }

    /**
     * Update Developer
     * Updates a developer.
     *
     * Methods:
     *  - POST /{id}
     *  - PUT /{id}
     *  - PATCH /{id}
     *
     */
    @Post("/:id(\\d+)")
    @Put("/:id(\\d+)")
    @Patch("/:id(\\d+)")
    public updateDeveloper(
        @Param('id') developerId: number,
        @Body() body: NewDeveloper,
        @QueryParams() query: NewDeveloper
    ) {
        return DevelopersJsonController.editOne(developerId, {...query, ...body});
    }

    /**
     * Delete Developer
     * Deletes a developer.
     *
     * Methods:
     *  - DELETE /{id}
     *  - POST /{id}/delete
     *
     */
    @Delete("/:id(\\d+)")
    @Post("/:id(\\d+)/delete")
    public deleteDeveloper(@Param('id') developerId: number) {
        return DevelopersJsonController.deleteOne(developerId);
    }

}
