/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import path from 'path';

import express, { Request, Response } from 'express';
import sass from 'node-sass-middleware';

const port = 8080;
const debug = true;

// Create the Express app
const app = express();

// Set up views
app.set('view engine', 'pug')
app.set('views', './views')

// Set up SASS
app.use(sass({
    src: path.join(__dirname, 'styles'),
    dest: path.join(__dirname, 'public', 'styles'),
    debug: debug,
    outputStyle: 'compressed',
    prefix:  '/styles',
    sourceMap: debug
}));

// Include the source files if we're debugging
if(debug) app.use('/styles', express.static(path.join(__dirname, 'styles')));

// Set up public folder
app.use(express.static(path.join(__dirname, 'public')));

const projects = (require('./projects.json') as Array<{ id:number, name: string, hidden?: boolean }>).filter(p => !p.hidden).sort((a,b) => a.name.localeCompare(b.name));
const featured = projects.find(p => p.id == 4);

// Homepage
app.get( "/", (req: Request, res: Response) => {
    res.format({
        'html': () => res.render('index', { Projects: projects, FeaturedProject: featured })
    })
});

// Start listening
app.listen(port);
