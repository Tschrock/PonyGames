#!/usr/bin/env node
/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';


// Imports
import * as path from 'path';

import * as httpError from 'http-errors';

import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';

import { useExpressServer, RoutingControllersOptions } from "routing-controllers";

import { timeRequest, timeMiddleware } from '../lib/RequestTimer';
import { NoNext } from '../lib/NoNext';

// Important Paths
export const jsRoot = path.join(__dirname, '..');
export const modelsRoot = path.join(jsRoot, 'models');
export const routesRoot = path.join(jsRoot, 'routes');
export const controllersRoot = path.join(jsRoot, 'controllers');
export const publicJsRoot = path.join(jsRoot, 'public');
export const serverRoot = path.join(jsRoot, '..');
export const publicRoot = path.join(serverRoot, 'public');
export const viewsRoot = path.join(serverRoot, 'views');

// Helpers

/**
 * Gets if the app is in a development environment.
 * @param app The Express app.
 */
export function isDev(app: express.Express) {
    return app.get('env') === 'development';
}

/**
 * `require()`s and adds a router for the given route.
 * @param app The Express app.
 * @param route The route to use.
 * @param location The location of the Router to use.
 */
function setupRoute(app: express.Express, route: string, location: string){
    app.use(route, require(path.join(routesRoot, location)) as express.Router);
}

const defaultOps = { classTransformer: false, defaultErrorHandler: false, middlewares: [NoNext] };

/**
 * `require()`s and adds a controller for the given route.
 * @param app The Express app.
 * @param route The route to use.
 * @param location The location of the Router to use.
 */
function setupController(app: express.Express, route: string, location: string, otherOptions?: RoutingControllersOptions){
    useExpressServer(app, {
        ...defaultOps,
        routePrefix: route,
        controllers: [require(path.join(controllersRoot, location))], // tslint:disable-line:no-unsafe-any
        ...otherOptions
    });
}

/**
 * Setup Express
 */
export function setupExpress() {

    const app = express();

    // Pug View Rendering
    app.set('views', viewsRoot);
    app.set('view engine', 'pug');

    // Preformance Timing
    app.use(timeRequest);

    // Request Logging
    app.use(timeMiddleware(logger('dev')));

    // Favicon Caching
    app.use(timeMiddleware(favicon(path.join(publicRoot, 'favicon.ico'))));

    // Request Body Parsing
    app.use(timeMiddleware(bodyParser.json()));
    app.use(timeMiddleware(bodyParser.urlencoded({ extended: false })));

    // Cookie Parsing
    app.use(timeMiddleware(cookieParser()));

    // Static Content
    app.use(timeMiddleware(express.static(publicJsRoot)));
    app.use(timeMiddleware(express.static(publicRoot)));

    // Dynamic Content

    setupController(app, '/teams', 'TeamController');
    setupController(app, '/developers', 'DeveloperController');
    setupController(app, '/projects', 'ProjectController');
    setupController(app, '/', 'ProjectController');

    // Everything else is a 404
    app.use((req, res, next) => {
        console.log('make404');
        next(new httpError.NotFound());
    });

    // Serve Error Page
    app.use((err: Error | httpError.HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log('error page');
        const errHttp = err instanceof httpError.HttpError ? err : httpError(err);
        errHttp.expose = isDev(app);
        res.status(errHttp.status);
        res.render('error', { error: errHttp });
        console.log('end error page');
    });

    return app;
}
