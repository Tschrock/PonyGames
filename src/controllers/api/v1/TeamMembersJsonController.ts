/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
'use strict';

// tslint:disable:prefer-function-over-method

import { JsonController, Get, QueryParams, Param, Post, Delete, Put, Patch, Body, UseAfter, Params } from "routing-controllers";

import { IPaginateOptions, paginate } from "../../../lib/FindHelper";
import { validate } from "../../../lib/ValidationHelper";

import { TeamMember } from "../../../models/TeamMember";
import { Team } from "../../../models/Team";
import { Developer } from "../../../models/Developer";

import { JsonErrorHandler } from "./JsonErrorHandler";
import { NewTeamMember } from "./params/NewTeamMember";

interface IFilterOptions {
    teamId?: number;
    developerId?: number;
}

/** TeamMembersJsonController */
@JsonController()
@UseAfter(JsonErrorHandler)
export default class TeamMembersJsonController {

    // ============================== //
    //       Controller Methods       //
    // ============================== //

    /**
     * Gets all TeamMembers.
     * @param pageOptions Options for paginating the results.
     */
    public static getAll(pageOptions: IPaginateOptions & IFilterOptions): PromiseLike<TeamMember[]> {
        
        const filter: IFilterOptions = {};
        if(pageOptions.developerId) filter.developerId = pageOptions.developerId;
        if(pageOptions.teamId) filter.teamId = pageOptions.teamId;
        
        return TeamMember
            .findAll({
                include: [Team, Developer],
                order: [['name', 'ASC']],
                where: filter,
                ...paginate(pageOptions)
            });

    }

    /**
     * Gets a single TeamMember.
     * @param id The TeamMember's id.
     */
    public static getOne(id: number): PromiseLike<TeamMember> {

        return TeamMember.findById(
            id,
            {
                include: [Team, Developer],
            }
        );

    }

    /**
     * Creates a new TeamMember.
     * @param newTeamMember The new TeamMember.
     */
    public static createOne(newTeamMember: NewTeamMember): PromiseLike<TeamMember> {
        newTeamMember = Object.assign(new NewTeamMember(), newTeamMember);
        return validate(newTeamMember)
            .then(_ => {
                console.log(newTeamMember);
                const { ...newTeamMemberProps } = newTeamMember;
                return TeamMember
                    .create(newTeamMemberProps) as PromiseLike<TeamMember>;
            });
    }

    /**
     * Edits a TeamMember.
     * @param id The TeamMember's id.
     * @param editTeamMember The edited TeamMember.
     */
    public static editOne(id: number, editTeamMember: Partial<NewTeamMember>): PromiseLike<TeamMember> {
        editTeamMember = Object.assign(new NewTeamMember(), editTeamMember);
        return validate(editTeamMember)
            .then(_ => {
                console.log(editTeamMember);
                const { ...editTeamMemberProps } = editTeamMember;
                return TeamMember
                    .findById(id)
                    .then(teamMember => (teamMember as TeamMember).update(editTeamMemberProps)) as PromiseLike<TeamMember>;
            });
    }

    /**
     * Deletes a TeamMember.
     * @param id The TeamMember's id.
     */
    public static deleteOne(id: number): PromiseLike<void> {

        return TeamMember.findById(id).then(teamMember => (teamMember as TeamMember).destroy());

    }

    // ========================== //
    //       Route Handling       //
    // ========================== //

    /**
     * TeamMember Index
     * Gets TeamMembers with their tags, paginated and sorted by name.
     *
     * Methods:
     *  - GET /
     *
     */
    @Get("/")
    public getTeamMembers(@Params() routeParams: IPaginateOptions & IFilterOptions, @QueryParams() queryParams: IPaginateOptions & IFilterOptions) {
        return TeamMembersJsonController.getAll({ ...routeParams, ...queryParams }).then(teamMembers => teamMembers.map(p => ({
            id: p.id,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            team: {
                id: p.team.id,
                name: p.team.name,
                shortDescription: p.team.shortDescription,
            },
            developer: {
                id: p.developer.id,
                name: p.developer.name,
                shortDescription: p.developer.shortDescription,
            },
        })));
    }

    /**
     * TeamMember Details
     * Gets the details for a TeamMember.
     *
     * Methods:
     *  - GET /{id}
     *
     */
    @Get("/:teamMemberId(\\d+)")
    public getTeamMember(@Param('teamMemberId') teamMemberId: number) {
        return TeamMembersJsonController.getOne(teamMemberId).then(p => ({
            id: p.id,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            team: {
                id: p.team.id,
                name: p.team.name,
                shortDescription: p.team.shortDescription,
                description: p.team.description,
                createdAt: p.team.createdAt,
                updatedAt: p.team.updatedAt,
            },
            developer: {
                id: p.developer.id,
                name: p.developer.name,
                shortDescription: p.developer.shortDescription,
                description: p.developer.description,
                createdAt: p.developer.createdAt,
                updatedAt: p.developer.updatedAt,
            },
        }));
    }

    /**
     * Create TeamMember
     * Creates a new TeamMember.
     *
     * Methods:
     *  - POST /
     *
     */
    @Post("/")
    public createTeamMember(
        @Params() route: NewTeamMember,
        @Body() body: NewTeamMember,
        @QueryParams() query: NewTeamMember,
    ) {
        return TeamMembersJsonController.createOne({...route, ...query, ...body});
    }

    /**
     * Update TeamMember
     * Updates a TeamMember.
     *
     * Methods:
     *  - POST /{id}
     *  - PUT /{id}
     *  - PATCH /{id}
     *
     */
    @Post("/:teamMemberId(\\d+)")
    @Put("/:teamMemberId(\\d+)")
    @Patch("/:teamMemberId(\\d+)")
    public updateTeamMember(
        @Param('teamMemberId') teamMemberId: number,
        @Body() body: NewTeamMember,
        @QueryParams() query: NewTeamMember,
    ) {
        return TeamMembersJsonController.editOne(teamMemberId, {...query, ...body});
    }

    /**
     * Delete TeamMember
     * Deletes a TeamMember.
     *
     * Methods:
     *  - DELETE /{id}
     *  - POST /{id}/delete
     *
     */
    @Delete("/:teamMemberId(\\d+)")
    @Post("/:teamMemberId(\\d+)/delete")
    public deleteTeamMember(@Param('teamMemberId') teamMemberId: number) {
        return TeamMembersJsonController.deleteOne(teamMemberId);
    }

}
