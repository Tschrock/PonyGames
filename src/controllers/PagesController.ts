/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Router, Get, HttpError } from "../lib/cp3-express-decorators";
import { Request, Response, NextFunction } from "express";

import { AuthService } from '../services';

import { Project } from '../models/Project';
import { paginate } from "../lib/FindHelper";

export class PagesController extends Router {

    constructor(private authService: AuthService) {
        super();
    }

    @Get("/")
    public async getHomePage(req: Request, res: Response, next: NextFunction) {

        const projects = await Project.findAll({ order: [['name', 'ASC']], ...paginate(req.query) });

        const featuredProject = await Project.findOne(); // TODO: Set up a "featured project" system

        res.format({
            html: () => res.render('home', { projects, featuredProject })
        });

    }

    @Get("/login")
    public async getLoginPage(req: Request, res: Response, next: NextFunction) {

        res.format({
            html: () => res.render('login', { providers: this.authService.getProviders() })
        });

    }
}

