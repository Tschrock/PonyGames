/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/



import { Router, Get, Post, Delete, Put, Patch, UseBefore, UseAfter } from "../../../lib/cp3-express-decorators";
import { Request, Response, NextFunction } from "express";

import { IPaginateOptions, paginate } from "../../../lib/FindHelper";
import { validate } from "../../../lib/ValidationHelper";

import { Developer } from "../../../models/Developer";
import { TeamMember } from "../../../models/TeamMember";
import { Team } from "../../../models/Team";

import { NewDeveloper } from "./params/NewDeveloper";

import { TeamMembersJsonController } from "./TeamMembersJsonController";

/** DevelopersJsonController */
export class DevelopersJsonController extends Router {

    // ========================== //
    //      JSON Formatting       //
    // ========================== //

    public static getShortJsonObject(developer: Developer) {
        return {
            id: developer.id,
            name: developer.name,
            summary: developer.summary,
        };
    }

    public static getMediumJsonObject(developer: Developer) {
        return {
            id: developer.id,
            name: developer.name,
            summary: developer.summary,
            teamMemberships: developer.teamMemberships ? developer.teamMemberships.map(TeamMembersJsonController.getShortJsonObject) : [],
        };
    }

    public static getFullJsonObject(developer: Developer) {
        return {
            id: developer.id,
            name: developer.name,
            summary: developer.summary,
            description: developer.description,
            createdAt: developer.createdAt,
            updatedAt: developer.updatedAt,
            teamMemberships: developer.teamMemberships ? developer.teamMemberships.map(TeamMembersJsonController.getMediumJsonObject) : [],
        };
    }

    // ============================== //
    //       Controller Methods       //
    // ============================== //

    private static DefaultInclude = [{ model: TeamMember, include: [Team] }];

    /**
     * Gets all developers.
     * @param pageOptions Options for paginating the results.
     */
    public static async getAll(pageOptions: IPaginateOptions): Promise<Developer[]> {

        return Developer
            .findAll({
                include: this.DefaultInclude,
                order: [['name', 'ASC']],
                ...paginate(pageOptions)
            });

    }

    /**
     * Gets a single developer.
     * @param id The developer's id.
     */
    public static async getOne(id: number): Promise<Developer | null> {

        return Developer.findById(id, { include: this.DefaultInclude });

    }

    /**
     * Creates a new developer.
     * @param newDeveloper The new developer.
     */
    public static createOne(newDeveloper: NewDeveloper): PromiseLike<Developer> {
        newDeveloper = Object.assign(new NewDeveloper(), newDeveloper);
        return validate(newDeveloper)
            .then(_ => {
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
    public getDevelopers(req: Request, res: Response, next: NextFunction) {
        return DevelopersJsonController.getAll(req.query).then(developers => developers.map(p => ({
            id: p.id,
            name: p.name,
            summary: p.summary,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            teamMemberships: p.teamMemberships.map(tm => ({
                id: tm.id,
                roles: tm.roles,
                team: {
                    id: tm.team.id,
                    name: tm.team.name,
                    summary: tm.team.summary,
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
    public getDeveloper(req: Request, res: Response, next: NextFunction) {
        return DevelopersJsonController.getOne(+req.params.id).then(d => {
            if (d) return {
                id: d.id,
                name: d.name,
                summary: d.summary,
                createdAt: d.createdAt,
                updatedAt: d.updatedAt,
                teamMemberships: d.teamMemberships.map(tm => ({
                    id: tm.id,
                    roles: tm.roles,
                    createdAt: tm.createdAt,
                    updatedAt: tm.updatedAt,
                    team: {
                        id: tm.team.id,
                        name: tm.team.name,
                        summary: tm.team.summary,
                    },
                })),
            }
            else return null;
        });
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
    public createDeveloper(req: Request, res: Response, next: NextFunction) {
        return DevelopersJsonController.createOne({ ...req.query, ...req.body });
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
    public updateDeveloper(req: Request, res: Response, next: NextFunction) {
        return DevelopersJsonController.editOne(+req.params.id, { ...req.query, ...req.body });
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
    public deleteDeveloper(req: Request, res: Response, next: NextFunction) {
        return DevelopersJsonController.deleteOne(+req.params.id);
    }

}
