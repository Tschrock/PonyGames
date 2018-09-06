/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';


// Imports
import { join as joinPath } from 'path';
import { randomBytes } from 'crypto';

import { NotFound } from 'http-errors';
import { Sequelize } from 'sequelize';
import { Authenticator } from 'passport';

import * as express from 'express';
import * as logger from 'morgan';
import * as processFavicon from 'serve-favicon';
import { json as processJson, urlencoded as processUrlEncoded } from 'body-parser';
import * as processCookies from 'cookie-parser';
import * as processSessions from "express-session";
import createSequelizeStore = require("connect-session-sequelize");
const tSequelizeStore = createSequelizeStore(processSessions.Store);

import { useExpressServer, RoutingControllersOptions } from "routing-controllers";

import { timeRequest, timeMiddleware } from '../lib/RequestTimer';
import { NoNext } from '../lib/NoNext';
import { IConfig } from '../lib/Config';
import { ErrorHandler } from '../controllers/ErrorHandler';


// Important Paths
export const jsRoot = joinPath(__dirname, '..');
export const modelsRoot = joinPath(jsRoot, 'models');
export const routesRoot = joinPath(jsRoot, 'routes');
export const controllersRoot = joinPath(jsRoot, 'controllers');
export const publicJsRoot = joinPath(jsRoot, 'client');
export const serverRoot = joinPath(jsRoot, '..');
export const publicRoot = joinPath(serverRoot, 'public');
export const viewsRoot = joinPath(serverRoot, 'views');

// Helpers

/**
 * `require()`s and adds a router for the given route.
 * @param app The Express app.
 * @param route The route to use.
 * @param location The location of the Router to use.
 */
function setupRoute(app: express.Express, route: string, location: string) {
    app.use(route, require(joinPath(routesRoot, location)) as express.Router);
}

const defaultOps = { classTransformer: false, defaultErrorHandler: false, middlewares: [NoNext] };

/**
 * `require()`s and adds a controller for the given route.
 * @param app The Express app.
 * @param route The route to use.
 * @param location The location of the Router to use.
 */
function useController(app: express.Express, route: string, location: string, otherOptions?: RoutingControllersOptions) {
    useExpressServer(app, {
        ...defaultOps,
        routePrefix: route,
        controllers: [require(joinPath(controllersRoot, location)).default], // tslint:disable-line:no-unsafe-any
        ...otherOptions
    });
}

const DEFAULT_COOKIE_SECRET_RANDOM_BYTES = 20;

/**
 * Setup Express
 */
export function setupExpress(options: IConfig, sequelizeDb: Sequelize, passport: Authenticator<express.Handler, express.Handler>) {

    const app = express();

    // Enable proxy handling
    // app.set('trust proxy', '127.0.0.1');
    app.set('trust proxy', 1);

    // Pug View Rendering
    app.set('views', viewsRoot);
    app.set('view engine', 'pug');

    // Preformance Timing
    app.use(timeRequest);

    // Request Logging
    app.use(timeMiddleware(logger('dev')));

    // Favicon Caching
    app.use(timeMiddleware(processFavicon(joinPath(publicRoot, 'favicon.ico'))));

    // Request Body Parsing
    app.use(timeMiddleware(processJson()));
    app.use(timeMiddleware(processUrlEncoded({ extended: false })));

    // Cookie Parsing

    const cookieSecret = options.web.cookieSecret || randomBytes(DEFAULT_COOKIE_SECRET_RANDOM_BYTES).toString('hex');
    app.use(timeMiddleware(processCookies(cookieSecret)));

    // Sessions
    app.use(processSessions({
        cookie: {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
        },
        secret: cookieSecret,
        store: new tSequelizeStore({
            db: sequelizeDb,
        }),
        resave: false,
        proxy: true,
        saveUninitialized: true,
    }));

    // Authentication
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/login', (req, res) => res.render('login'));
    app.get('/login/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/login',
    }) as express.RequestHandler);


    // Static Content
    app.use(timeMiddleware(express.static(publicJsRoot)));
    app.use(timeMiddleware(express.static(publicRoot)));

    // Dynamic Content

    // API
    useController(app, '/api/v1/projects', 'api/v1/ProjectsJsonController');
    useController(app, '/api/v1/teams', 'api/v1/TeamsJsonController');
    useController(app, '/api/v1/teammembers', 'api/v1/TeamMembersJsonController');
    useController(app, '/api/v1/developers', 'api/v1/DevelopersJsonController');

    /// API-Extras
    useController(app, '/api/v1/teams/:teamId(\\d+)/members', 'api/v1/TeamMembersJsonController');
    useController(app, '/api/v1/developers/:developerId(\\d+)/memberships', 'api/v1/TeamMembersJsonController');

    // Website
    useController(app, '/teams', 'TeamsController');
    useController(app, '/developers', 'DevelopersController');
    useController(app, '/projects', 'ProjectsController');
    useController(app, '/', 'ProjectsController');

    // Everything else is a 404
    app.use((req, res, next) => {
        next(new NotFound());
    });

    // Serve Error Page
    const eHandler = new ErrorHandler();
    app.use(eHandler.error.bind(eHandler) as express.ErrorRequestHandler);

    return app;
}
