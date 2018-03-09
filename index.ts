#!/usr/bin/env node
'use strict';

import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as debugBuilder from 'debug';
import * as http from 'http';
import { Sequelize } from 'sequelize-typescript';

import { loadTestData } from './testData';
import { HttpError_404_NotFound } from './lib/HttpError';
import { timeRequest } from './lib/RequestTimer';

const routesRoot = './routes/'
const setupRoute = (route: string, routerLocation: string) => app.use(route, require(`${routesRoot}${routerLocation}`));
const debug = debugBuilder('myapp:server');

const config = require('./config.json');


/**
 * Setup Express
 */

const app = express();

// .pug view rendering
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Preformance Loging
app.use(timeRequest);

// Favicon caching middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Request logging middleware
app.use(logger('dev'));

// Request body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie parsing middleware
app.use(cookieParser());

// Server static content
app.use(express.static(path.join(__dirname, 'public')));

// Serve dynamic content
setupRoute('/', 'index');
setupRoute('/project', 'project');
setupRoute('/team', 'team');
setupRoute('/developer', 'developer');

// Mark anything else as a 404
app.use((req: Request, res: Response, next: NextFunction) => next(new HttpError_404_NotFound()));

// Serve error page
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


/**
 * Setup Sequelize
 */

const sequelize = new Sequelize({
    dialect: config.db.dialect,
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    username: config.db.username,
    password: config.db.password,
    storage: config.db.storage,
    modelPaths: [__dirname + '/models'],
    logging: app.get('env') === 'development' ? console.log : false,
    operatorsAliases: false
});

if (app.get('env') === 'development') {
    sequelize.sync({ force: true }).then(() => loadTestData());
}
else {
    sequelize.sync();
}

/**
 * Create HTTP server.
 */

const port = 8080;
app.set('port', port);

const server = http.createServer(app)
    .listen(port)
    .on('error', (error: NodeJS.ErrnoException) => {
        if (error.syscall !== 'listen') {
            throw error;
        }

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(`Port ${port} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`Port ${port} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    })
    .on('listening', () => {
        debug(`Listening on ${server.address().port}`);
    });
