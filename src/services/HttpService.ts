/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Server, IncomingMessage, ServerResponse } from "http";

export type RequestHandler = (request: IncomingMessage, response: ServerResponse) => void;

export class HttpService {

        public readonly httpServer: Server;
        public readonly port: number;

        constructor(port: number, requestHandler: RequestHandler) {
            this.port = port;

            // Make a new Server
            this.httpServer = new Server();

            // Hook up server events
            this.httpServer.on('listening', this.OnListening.bind(this));
            this.httpServer.on('close', this.OnClose.bind(this));
            this.httpServer.on('error', this.OnError.bind(this));

            // Hook up handler
            this.httpServer.on('request', requestHandler);

            // Start listening
            this.httpServer.listen(this.port);
        }

        private OnListening() {
            console.debug(`HTTP server listening on port ${this.port}`);
        }

        private OnClose() {
            console.debug(`HTTP server closed on port ${this.port}`);
        }

        private OnError(error: NodeJS.ErrnoException) {
            
            // We only care about listen errors
            if (error.syscall !== 'listen') throw error;

            // Check the error code
            switch (error.code) {
                case 'EACCES':
                    console.error(`Error: Could not listen on port ${this.port}: Access Denied (Port may require elevated privileges)`);
                    break;
                case 'EADDRINUSE':
                    console.error(`Error: Could not listen on port ${this.port}: Port is already in use by another process`);
                    break;
                default:
                    throw error;
            }

        }
}
