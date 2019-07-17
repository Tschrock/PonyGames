/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Response, Request, NextFunction } from 'express';

import { Controller, Router, Get, Render } from '../cp3-express';
import { Project, Image, Link } from '../models';

@Router("/")
export class PagesController extends Controller<PagesController> {

    @Get("/")
    @Render("index")
    protected async getIndex() {

        const Projects = await Project.findAll({ include: [ Image, Link ] });

        return { Projects };

    }

    @Get("/login")
    public getLogin(req: Request, res: Response, next: NextFunction) {
        res.redirect('/auth/twitter');
    }

    @Get("/logout")
    public getLogout(req: Request, res: Response, next: NextFunction) {
        req.logout();
        res.redirect('/');
    }
    
}
