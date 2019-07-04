/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import path from 'path';

import express, { Request, Response } from 'express';

const port = process.env.PORT || 8080;
const debug = true;

// Create the Express app
const app = express();

const serverRoot = __dirname;
const distRoot = path.join(serverRoot, '..');
const rootRoot = path.join(distRoot, '..');
const clientRoot = path.join(distRoot, 'client');
const clientScriptRoot = path.join(clientRoot, 'scripts');
const clientStyleRoot = path.join(clientRoot, 'styles');
const projectsJson = path.join(rootRoot, 'projects.json');
const publicRoot = path.join(rootRoot, 'public');
const viewsRoot = path.join(rootRoot, 'views');

// Set up views
app.set('view engine', 'pug');
app.set('views', viewsRoot);

// Include the source files if we're debugging
if(debug) app.use('/styles', express.static(path.join(__dirname, 'styles')));

// Set up public folder
app.use(express.static(publicRoot));
app.use('/scripts', express.static(clientScriptRoot));
app.use('/styles', express.static(clientStyleRoot));

const projects = (require(projectsJson) as Array<{ id:number, name: string, hidden?: boolean }>).filter(p => !p.hidden).sort((a,b) => a.name.localeCompare(b.name));
const featured = projects.find(p => p.id === 4);

// Homepage
app.get( "/", (req: Request, res: Response) => {
    res.format({
        'html': () => res.render('index', { Projects: projects, FeaturedProject: featured })
    });
});

// Projects
app.get( "/project/:id", (req: Request, res: Response) => {
    const projectId = Number.parseInt(req.params["id"], 10);
    const project = projects.find(p => p.id === projectId);
    if(project) {
        res.format({
            'html': () => res.render('project', { Project: project })
        });
    }
    else {
        res.sendStatus(404);
    }
});

// Start listening
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
