/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { Router, Get, Post, Delete, Put, Patch, HttpError, ParseJson, ValidateCsrf } from "../../../lib/cp3-express-decorators";
import { Request, Response, NextFunction } from "express";

import { paginate } from "../../../lib/FindHelper";
import { validate } from "../../../lib/ValidationHelper";

import { Team } from "../../../models/Team";
import { TeamMember } from "../../../models/TeamMember";
import { Developer } from "../../../models/Developer";
import { Project } from "../../../models/Project";

import { NewTeam } from "./params/NewTeam";

import { ProjectsJsonController } from "./ProjectsJsonController";
import { TeamMembersJsonController } from "./TeamMembersJsonController";

/**
 * The controller for the v1 Teams API.
 */
export class TeamsJsonController extends Router {

    // ========================== //
    //      JSON Formatting       //
    // ========================== //

    public static getShortJsonObject(team: Team) {
        return {
            id: team.id,
            name: team.name,
            summary: team.summary,
        };
    }

    public static getMediumJsonObject(team: Team) {
        return {
            id: team.id,
            name: team.name,
            summary: team.summary,
            projects: team.projects ? team.projects.map(ProjectsJsonController.getShortJsonObject) : [],
            members: team.members ? team.members.map(TeamMembersJsonController.getShortJsonObject) : [],
        };
    }

    public static getFullJsonObject(team: Team) {
        return {
            id: team.id,
            name: team.name,
            summary: team.summary,
            description: team.description,
            createdAt: team.createdAt,
            updatedAt: team.updatedAt,
            projects: team.projects ? team.projects.map(ProjectsJsonController.getMediumJsonObject) : [],
            members: team.members ? team.members.map(TeamMembersJsonController.getMediumJsonObject) : [],
        };
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
    public async getTeams(req: Request, res: Response, next: NextFunction) {

        const teams = await Team.findAll({
            include: [Project, { model: TeamMember, include: [Developer] }],
            order: [['name', 'ASC']],
            ...paginate(req.query)
        });

        const teamsJSON = teams.map(TeamsJsonController.getMediumJsonObject);

        res.format({
            json: () => res.json(teamsJSON)
        });

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
    public async getTeam(req: Request, res: Response, next: NextFunction) {

        const team = await Team.findByPk(
            +req.params['teamId'],
            { include: [Project, { model: TeamMember, include: [Developer] }] }
        );

        if (!team) return next(new HttpError(404, "That Team does not exist."));

        const teamJSON = TeamsJsonController.getFullJsonObject(team);

        res.format({
            json: () => res.json(teamJSON)
        });

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
    @ParseJson()
    @ValidateCsrf()
    public async createTeam(req: Request, res: Response, next: NextFunction) {

        if (!req.user) return next(new HttpError(401, "Unauthorized"));
        if (!req.user.can('create', Team)) return next(new HttpError(403, "You do not have permission to create a Team."));

        const newTeamData = Object.assign(new NewTeam(), req.body);

        await validate(newTeamData);

        const team = await Team.create({ ...newTeamData });

        const teamJSON = TeamsJsonController.getFullJsonObject(team);

        res.format({
            json: () => res.json(teamJSON)
        });
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
    @ParseJson()
    @ValidateCsrf()
    public async updateTeam(req: Request, res: Response, next: NextFunction) {

        if (!req.user) return next(new HttpError(401, "Unauthorized"));

        const team = await Team.findByPk(+req.params['teamId']);

        if (!team) return next(new HttpError(404, "That Team does not exist."));
        if (!req.user.can('edit', team)) return next(new HttpError(403, "You do not have permission to edit this Team."));

        const newTeamData = Object.assign(new NewTeam(), req.body);

        await validate(newTeamData);

        const editedTeam = await team.update({ ...newTeamData });

        const teamJSON = TeamsJsonController.getFullJsonObject(editedTeam);

        res.format({
            json: () => res.json(teamJSON)
        });

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
    @ParseJson()
    @ValidateCsrf()
    public async deleteTeam(req: Request, res: Response, next: NextFunction) {

        if (!req.user) return next(new HttpError(401, "Unauthorized"));

        const team = await Team.findByPk(+req.params['teamId']);

        if (!team) return next(new HttpError(404, "That Team does not exist."));
        if (!req.user.can('delete', team)) return next(new HttpError(403, "You do not have permission to delete this Team."));

        await team.destroy();

        res.status(204).send();

    }

}
