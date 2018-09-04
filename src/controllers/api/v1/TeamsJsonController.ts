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

import { Team } from "../../../models/Team";
import { TeamMember } from "../../../models/TeamMember";
import { Developer } from "../../../models/Developer";
import { Project } from "../../../models/Project";

import { NewTeam } from "./params/NewTeam";
import { JsonErrorHandler } from "./JsonErrorHandler";

/** TeamJsonController */
@JsonController()
@UseAfter(JsonErrorHandler)
export default class TeamsJsonController {

    // ============================== //
    //       Controller Methods       //
    // ============================== //

    /**
     * Gets all Teams.
     * @param pageOptions Options for paginating the results.
     */
    public static getAll(pageOptions: IPaginateOptions): PromiseLike<Team[]> {

        return Team
            .findAll({
                include: [Project, { model: TeamMember, include: [Developer] }],
                order: [['name', 'ASC']],
                ...paginate(pageOptions)
            });

    }

    /**
     * Gets a single Team.
     * @param id The Team's id.
     */
    public static getOne(id: number): PromiseLike<Team> {

        return Team.findById(
            id,
            {
                include: [Project, { model: TeamMember, include: [Developer] }],
            }
        );

    }

    /**
     * Creates a new Team.
     * @param newTeam The new Team.
     */
    public static createOne(newTeam: NewTeam): PromiseLike<Team> {
        newTeam = Object.assign(new NewTeam(), newTeam);
        return validate(newTeam)
            .then(_ => {
                console.log(newTeam);
                const { ...newTeamProps } = newTeam;
                return Team.create(newTeamProps) as PromiseLike<Team>;
            });
    }

    /**
     * Edits a Team.
     * @param id The Team's id.
     * @param editTeam The edited Team.
     */
    public static editOne(id: number, editTeam: Partial<NewTeam>): PromiseLike<Team> {
        editTeam = Object.assign(new NewTeam(), editTeam);
        return validate(editTeam)
            .then(_ => {
                console.log(editTeam);
                const { ...editTeamProps } = editTeam;
                return Team
                    .findById(id)
                    .then(team => (team as Team).update(editTeamProps)) as PromiseLike<Team>;
            });
    }

    /**
     * Deletes a Team.
     * @param id The Team's id.
     */
    public static deleteOne(id: number): PromiseLike<void> {

        return Team.findById(id).then(team => (team as Team).destroy());

    }

    // ========================== //
    //       Route Handling       //
    // ========================== //

    /**
     * Team Index
     * Gets Teams with their tags, paginated and sorted by name.
     *
     * Methods:
     *  - GET /
     *
     */
    @Get("/")
    public getTeams(@QueryParams() queryParams: IPaginateOptions) {
        return TeamsJsonController.getAll(queryParams).then(teams => teams.map(t => ({
            id: t.id,
            name: t.name,
            shortDescription: t.shortDescription,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
            projects: t.projects.map(p => ({
                id: p.id,
                name: p.name,
                shortDescription: p.shortDescription,
            })),
            members: t.members.map(m => ({
                id: m.id,
                developer: {
                    id: m.developer.id,
                    name: m.developer.name,
                    shortDescription: m.developer.shortDescription,
                },
                roles: m.roles,
            })),
        })));
    }

    /**
     * Team Details
     * Gets the details for a Team.
     *
     * Methods:
     *  - GET /{id}
     *
     */
    @Get("/:teamId(\\d+)")
    public getTeam(@Param('teamId') teamId: number) {
        return TeamsJsonController.getOne(teamId).then(t => ({
            id: t.id,
            name: t.name,
            shortDescription: t.shortDescription,
            description: t.description,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
            projects: t.projects.map(p => ({
                id: p.id,
                name: p.name,
                shortDescription: p.shortDescription,
            })),
            members: t.members.map(m => ({
                id: m.id,
                developer: {
                    id: m.developer.id,
                    name: m.developer.name,
                    shortDescription: m.developer.shortDescription,
                },
                roles: m.roles,
                createdAt: m.createdAt,
                updatedAt: m.updatedAt,
            })),
        }));
    }

    /**
     * Create Team
     * Creates a new Team.
     *
     * Methods:
     *  - POST /
     *
     */
    @Post("/")
    public createTeam(
        @Body() body: NewTeam,
        @QueryParams() query: NewTeam
    ) {
        return TeamsJsonController.createOne({ ...query, ...body });
    }

    /**
     * Update Team
     * Updates a Team.
     *
     * Methods:
     *  - POST /{id}
     *  - PUT /{id}
     *  - PATCH /{id}
     *
     */
    @Post("/:teamId(\\d+)")
    @Put("/:teamId(\\d+)")
    @Patch("/:teamId(\\d+)")
    public updateTeam(
        @Param('teamId') teamId: number,
        @Body() body: NewTeam,
        @QueryParams() query: NewTeam
    ) {
        return TeamsJsonController.editOne(teamId, { ...query, ...body });
    }

    /**
     * Delete Team
     * Deletes a Team.
     *
     * Methods:
     *  - DELETE /{id}
     *  - POST /{id}/delete
     *
     */
    @Delete("/:teamId(\\d+)")
    @Post("/:teamId(\\d+)/delete")
    public deleteTeam(@Param('teamId') teamId: number) {
        return TeamsJsonController.deleteOne(teamId);
    }

}
