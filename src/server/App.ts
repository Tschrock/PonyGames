/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import path from 'path';

import express, { Express, RequestHandler, NextFunction, Response, Request } from 'express';
import { Authenticator } from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import processCookies from 'cookie-parser';
import processSession, { Store } from 'express-session';
import createSequelizeStore = require('connect-session-sequelize');
const SequelizeStore = createSequelizeStore(Store);

import { Config } from './Config';
import { ProjectsController, PagesController, ProjectsApiV1Controller, ImagesApiV1Controller } from './controllers';
import { Controller } from './cp3-express';
import { serializeUser, deserializeUser, verifyUser } from './Auth';
import { Database } from './Database';


const serverRoot = __dirname;
const distRoot = path.join(serverRoot, '..');
const rootRoot = path.join(distRoot, '..');
const clientRoot = path.join(distRoot, 'client');
const clientScriptRoot = path.join(clientRoot, 'scripts');
const clientStyleRoot = path.join(clientRoot, 'styles');
const publicRoot = path.join(rootRoot, 'public');
const viewsRoot = path.join(rootRoot, 'views');


export class App {

    public readonly app: Express;
    public readonly authenticator: Authenticator<RequestHandler, RequestHandler>;

    constructor(config: Config, database: Database) {

        this.app = express();

        // Set up views
        this.app.set('view engine', 'pug');
        this.app.set('views', viewsRoot);

        // Include the source files if we're debugging
        if (config.get('env') === "development") this.app.use('/styles', express.static(path.join(__dirname, 'styles')));

        // Set up public folder
        this.app.use(express.static(publicRoot));
        this.app.use('/scripts', express.static(clientScriptRoot));
        this.app.use('/styles', express.static(clientStyleRoot));

        // Set up cookies & session
        this.app.use(processCookies(Config.get('cookieSecret')));
        this.app.use(processSession({
            cookie: {
                httpOnly: true,
                //secure: true,
                sameSite: 'lax',
            },
            secret: Config.get('cookieSecret'),
            store: new SequelizeStore({ db: database.sequelize }),
            resave: false,
            proxy: true,
            saveUninitialized: true,
        }));

        // Set up Passport
        this.authenticator = new Authenticator() as unknown as Authenticator<RequestHandler, RequestHandler>;
        this.authenticator.serializeUser(serializeUser);
        this.authenticator.deserializeUser(deserializeUser);
        this.authenticator.use(new TwitterStrategy({
            ...Config.get('twitter')
        }, verifyUser));

        this.app.use(this.authenticator.initialize());
        this.app.use(this.authenticator.session());
        this.app.get('/auth/twitter', this.authenticator.authenticate('twitter'));
        this.app.get('/auth/twitter/callback', this.authenticator.authenticate('twitter', { failureRedirect: '/', successRedirect: '/'}));

        // Extras
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const locals = res.locals as Record<string, any>;
            locals.CurrentUser = req.user;
            locals.Session = req.session;
            next();
        });

        // Register Controllers
        this.registerController(new PagesController());
        this.registerController(new ProjectsController());
        this.registerController(new ProjectsApiV1Controller());
        this.registerController(new ImagesApiV1Controller());

    }

    protected registerController<T extends Controller<T>>(controller: Controller<T>) {
        const routerInfo = controller.buildRouter();
        if(routerInfo.path) this.app.use(routerInfo.path, routerInfo.router);
        else this.app.use(routerInfo.router);
    }

}
