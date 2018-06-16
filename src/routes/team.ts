/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Router, Request, NextFunction } from 'express';
import * as httpError from 'http-errors';

import { Team } from '../models/Team';
import { Developer } from '../models/Developer';
import { TeamDeveloper } from '../models/TeamDeveloper';
import { Project } from '../models/Project';

import { ITimedResponse, MARKS } from '../lib/RequestTimer';

const router = Router();

interface IRouteParameters {
    teamId: string;
 }

/* GET project page. */
router.get('/:teamId', (req: Request, res: ITimedResponse, next: NextFunction) => {
    res.locals.timer.markEnd(MARKS.ROUTING);
    res.locals.timer.markStart(MARKS.PROCESSING);

    const teamId = +(req.params as IRouteParameters).teamId;
    if (!isNaN(teamId)) {

        res.locals.timer.recordPromise(MARKS.DB,
            () => Team.findById(teamId, {
                include: [{ model: TeamDeveloper, include: [Developer] }, Project]
            })
        ).then(
            team => {
                res.locals.timer.markEnd(MARKS.PROCESSING);
                if (team) {
                    res.locals.timer.recordFunction(MARKS.RENDERING,
                        () => res.render('team', { team })
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
