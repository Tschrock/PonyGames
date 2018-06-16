/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Router, Request, NextFunction } from 'express';
import * as httpError from 'http-errors';

import { Project } from '../models/Project';
import { Tag } from '../models/Tag';
import { Team } from '../models/Team';
import { Developer } from '../models/Developer';
import { TeamDeveloper } from '../models/TeamDeveloper';

import { ITimedResponse, MARKS } from '../lib/RequestTimer';

const router = Router();

interface IRouteParameters {
    projectId: string;
 }

/* GET project page. */
router.get('/:projectId', (req: Request, res: ITimedResponse, next: NextFunction) => {
    res.locals.timer.markEnd(MARKS.ROUTING);
    res.locals.timer.markStart(MARKS.PROCESSING);

    const projectId = +(req.params as IRouteParameters).projectId;
    if (!isNaN(projectId)) {

        res.locals.timer.recordPromise(MARKS.DB,
            () => Project.findById(projectId, {
                include: [{ model: Team, include: [{ model: TeamDeveloper, include: [Developer] }] }, Tag]
            })
        ).then(
            project => {
                res.locals.timer.markEnd(MARKS.PROCESSING);
                if (project) {
                    res.locals.timer.recordFunction(MARKS.RENDERING,
                        () => res.render('project', { project })
                    );
                }
                else {
                    next(new httpError.NotFound());
                }
            },
            error => {
                res.locals.timer.markEnd(MARKS.PROCESSING);
                next(error);
            }
        );
    }
    else {
        res.locals.timer.markEnd(MARKS.PROCESSING);
        next(new httpError.NotFound());
    }
});

export = router;
