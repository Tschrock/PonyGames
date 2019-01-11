/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Imports

import express, { Express, RequestHandler, ErrorRequestHandler } from 'express';
import { Sequelize } from 'sequelize-typescript';

import { viewsRoot, faviconPath, publicJsRoot, publicRoot } from '../paths';

import { IConfig } from '../lib/IConfig';
import { ApiAuthHandler, AuthHandler, RequestTimer, RequestLogger, FaviconHandler, CookieHandler, SessionHandler, StaticServer, NotFoundHandler, JsonErrorHandler, HtmlErrorHandler, LocalsHandler } from '../middleware';
import { ProjectsJsonController, TeamsJsonController, TeamMembersJsonController, DevelopersJsonController } from '../controllers/api/v1';
import { AuthController, DevelopersController, ProjectsController, TeamsController, PagesController } from '../controllers';

import { AuthService } from './AuthService';

export interface IAmMiddleware {
    use: RequestHandler | ErrorRequestHandler;
}

// Express
export class ExpressService {

    public readonly app: Express;

    constructor(options: IConfig, database: Sequelize, authService: AuthService) {

        // Make a new Express app
        this.app = express();

        // Enable proxy handling
        this.app.set('trust proxy', 1);

        // Set up Pug view rendering
        this.app.set('views', viewsRoot);
        this.app.set('view engine', 'pug');

        // Add some default middleware
        this.app.use(new RequestTimer().use);
        this.app.use(new RequestLogger().use);

        this.app.use(new FaviconHandler(faviconPath).use);
        this.app.use(new StaticServer(publicJsRoot).use);
        this.app.use(new StaticServer(publicRoot).use);

        this.app.use(new CookieHandler(options.web.cookieSecret).use);
        this.app.use(new SessionHandler(options.web.cookieSecret, database).use);

        // Set up auth middleware
        this.app.use(authService.authenticator.initialize());
        

        // Set up API controllers
        const apiRouter = express.Router();
        
        apiRouter.use(new ApiAuthHandler(authService).use);
        
        apiRouter.use('/projects', ProjectsJsonController.build());
        apiRouter.use('/teams', TeamsJsonController.build());
        apiRouter.use('/teammembers', TeamMembersJsonController.build());
        apiRouter.use('/developers', DevelopersJsonController.build());
        
        apiRouter.use(new NotFoundHandler().use);
        apiRouter.use(new JsonErrorHandler().use);
        
        
        // Set up page controllers
        this.app.use('/api/v1/', apiRouter);
        
        this.app.use(new AuthHandler(authService).use);
        this.app.use(new LocalsHandler().use);
        
        this.app.use("/auth", new AuthController(authService).build());
        this.app.use("/teams", TeamsController.build());
        this.app.use("/developers", DevelopersController.build());
        this.app.use("/projects", ProjectsController.build());
        this.app.use("/", new PagesController(authService).build());
        
        this.app.use(new NotFoundHandler().use);
        this.app.use(new HtmlErrorHandler().use);

    }

}
