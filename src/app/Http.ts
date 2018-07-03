#!/usr/bin/env node
/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import * as http from 'http';

import * as debugBuilder from 'debug';
import { Express } from 'express';

import { IConfig } from '../lib/Config';

/**
 * Setup the http server.
 * @param options The application options.
 * @param app The Express app to serve.
 */
export function setupHttp(options: IConfig, app: Express) {

    // Setup debug
    const debugWeb = debugBuilder('web');

    /**
     * Create HTTP server.
     */
    const DEFAULT_HTTP_PORT = 8080;
    options.web.port = options.web.port || DEFAULT_HTTP_PORT;
    app.set('port', options.web.port);

    return http.createServer(app)
        .listen(options.web.port)
        .on('error', (error: NodeJS.ErrnoException) => {
            if (error.syscall !== 'listen') {
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

}
