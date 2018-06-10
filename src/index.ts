#!/usr/bin/env node
/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';

import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as debugBuilder from 'debug';
import * as httpError from 'http-errors';
import { Sequelize } from 'sequelize-typescript';

import { doConfig } from './config';
import { loadTestData } from './testData';
import { timeRequest, timeMiddleware } from './lib/RequestTimer';

// Define Paths
const jsRoot = __dirname;
const modelsRoot = path.join(jsRoot, 'models');
const routesRoot = path.join(jsRoot, 'routes');
const publicJsRoot = path.join(jsRoot, 'public');
const serverRoot = path.join(jsRoot, '..');
const publicRoot = path.join(serverRoot, 'public');
const viewsRoot = path.join(serverRoot, 'views');

// Setup debug
const debugWeb = debugBuilder('web');
const debugDb = debugBuilder('db');

// Get the Config
const options = doConfig();

console.log('Express');
/**
 * Setup Express
 */

const app = express();

/** Returns if the app is in development mode or not. */
function isDevelopment() {
    return app.get('env') === 'development';
}

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
const setupRoute = (route: string, location: string) => app.use(route, require(path.join(routesRoot, location)));

app.use('/', require(path.join(routesRoot, 'index')))
setupRoute('/', 'index');
setupRoute('/project', 'project');
setupRoute('/team', 'team');
setupRoute('/developer', 'developer');

// Everything else is a 404
app.use((req, res, next) => next(new httpError.NotFound()));

// Serve Error Page
app.use((err: Error | httpError.HttpError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const errHttp = err instanceof httpError.HttpError ? err :  httpError(err);
    errHttp.expose = isDevelopment();
    res.status(errHttp.status);
    res.render('error', { error: errHttp });
});

console.log('Sequelize');
/**
 * Setup Sequelize
 */

const sequelize = new Sequelize({
    // Basic Config
    logging: debugDb,
    modelPaths: [modelsRoot],
    operatorsAliases: false,

    // Default DB
    database: 'website',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: ':memory:',

    // User Config
    ...options.db
});

if(isDevelopment()) {
    sequelize.sync({ force: true }).then(() => loadTestData());
}
else {
    sequelize.sync();
}

console.log('HTTP');
/**
 * Create HTTP server.
 */

options.web.port = options.web.port || 8080;
app.set('port', options.web.port);

http.createServer(app as any)
    .listen(options.web.port)
    .on('error', (error: NodeJS.ErrnoException) => {
        if(error.syscall !== 'listen') {
            throw error;
        }

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(`Port ${options.web.port} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`Port ${options.web.port} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    })
    .on('listening', () => {
        debugWeb(`Listening on ${options.web.port}`);
    });

console.log('Done');
