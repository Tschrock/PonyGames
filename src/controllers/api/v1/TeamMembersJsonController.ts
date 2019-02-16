/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { Router, Get, Post, Delete, Put, Patch, HttpError, ParseJson, ValidateCsrf } from "../../../lib/cp3-express-decorators";
import { Request, Response, NextFunction } from "express";

import { paginate } from "../../../lib/FindHelper";
import { validate } from "../../../lib/ValidationHelper";

import { TeamMember } from "../../../models/TeamMember";
import { Team } from "../../../models/Team";
import { Developer } from "../../../models/Developer";

import { NewTeamMember } from "./params/NewTeamMember";

import { TeamsJsonController } from "./TeamsJsonController";
import { DevelopersJsonController } from "./DevelopersJsonController";

interface IFilterOptions {
    teamId?: number;
    developerId?: number;
}

/**
 * The controller for the v1 TeamMembers API.
 */
export class TeamMembersJsonController extends Router {

    // ========================== //
    //      JSON Formatting       //
    // ========================== //

    public static getShortJsonObject(teamMember: TeamMember) {
        return {
            id: teamMember.id,
            roles: teamMember.roles,
            team: teamMember.team ? TeamsJsonController.getShortJsonObject(teamMember.team) : null,
            developer: teamMember.developer ? DevelopersJsonController.getShortJsonObject(teamMember.developer) : null
        };
    }

    public static getMediumJsonObject(teamMember: TeamMember) {
        return {
            id: teamMember.id,
            roles: teamMember.roles,
            team: teamMember.team ? TeamsJsonController.getMediumJsonObject(teamMember.team) : null,
            developer: teamMember.developer ? DevelopersJsonController.getMediumJsonObject(teamMember.developer) : null
        };
    }

    public static getFullJsonObject(teamMember: TeamMember) {
        return {
            id: teamMember.id,
            roles: teamMember.roles,
            createdAt: teamMember.createdAt,
            updatedAt: teamMember.updatedAt,
            team: teamMember.team ? TeamsJsonController.getMediumJsonObject(teamMember.team) : null,
            developer: teamMember.developer ? DevelopersJsonController.getMediumJsonObject(teamMember.developer) : null
        };
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
    public async getTeamMembers(req: Request, res: Response, next: NextFunction) {

        const params = { ...req.params, ...req.query };

        const filter: IFilterOptions = {};
        if (params.developerId) filter.developerId = +params.developerId;
        if (params.teamId) filter.teamId = +params.teamId;

        const members = await TeamMember.findAll({
            include: [Team, Developer],
            order: [['name', 'ASC']],
            where: filter,
            ...paginate(params)
        });

        const membersJSON = members.map(TeamMembersJsonController.getMediumJsonObject);


        res.format({
            json: () => res.json(membersJSON)
        });

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
    public async getTeamMember(req: Request, res: Response, next: NextFunction) {

        const member = await TeamMember.findByPk(
            +req.params['teamMemberId'],
            { include: [Team, Developer] }
        );

        if (!member) return next(new HttpError(404, "That TeamMember does not exist."));

        const memberJSON = TeamMembersJsonController.getFullJsonObject(member);

        res.format({
            json: () => res.json(memberJSON)
        });

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
    @ParseJson()
    @ValidateCsrf()
    public async createTeamMember(req: Request, res: Response, next: NextFunction) {

        if (!req.user) return next(new HttpError(401, "Unauthorized"));
        if (!req.user.can('create', TeamMember)) return next(new HttpError(403, "You do not have permission to create a TeamMember."));

        const newMemberData = Object.assign(new NewTeamMember(), req.body);

        await validate(newMemberData);

        const member = await TeamMember.create({ ...newMemberData });

        const memberJSON = TeamMembersJsonController.getFullJsonObject(member);

        res.format({
            json: () => res.json(memberJSON)
        });

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
    @ParseJson()
    @ValidateCsrf()
    public async updateTeamMember(req: Request, res: Response, next: NextFunction) {

        if (!req.user) return next(new HttpError(401, "Unauthorized"));

        const member = await TeamMember.findByPk(+req.params['teamMemberId']);

        if (!member) return next(new HttpError(404, "That TeamMember does not exist."));
        if (!req.user.can('edit', member)) return next(new HttpError(403, "You do not have permission to edit this TeamMember."));

        const newMemberData = Object.assign(new NewTeamMember(), req.body);

        await validate(newMemberData);

        const editedMember = await member.update({ ...newMemberData });

        const memberJSON = TeamMembersJsonController.getFullJsonObject(editedMember);

        res.format({
            json: () => res.json(memberJSON)
        });
    
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
    @ParseJson()
    @ValidateCsrf()
    public async deleteTeamMember(req: Request, res: Response, next: NextFunction) {

        if (!req.user) return next(new HttpError(401, "Unauthorized"));

        const member = await TeamMember.findByPk(+req.params['teamMemberId']);

        if (!member) return next(new HttpError(404, "That TeamMember does not exist."));
        if (!req.user.can('delete', member)) return next(new HttpError(403, "You do not have permission to delete this Team Member."));

        await member.destroy();

        res.status(204).send();

    }

}
