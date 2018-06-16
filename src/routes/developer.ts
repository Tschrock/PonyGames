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
    developerId: string;
 }

/* GET project page. */
router.get('/:developerId', (req: Request, res: ITimedResponse, next: NextFunction) => {
    res.locals.timer.markEnd(MARKS.ROUTING);
    res.locals.timer.markStart(MARKS.PROCESSING);

    const developerId = +(req.params as IRouteParameters).developerId;
    if (!isNaN(developerId)) {

        res.locals.timer.recordPromise(MARKS.DB,
            () => Developer.findById(developerId, {
                include: [{ model: TeamDeveloper, include: [{ model: Team, include: [Project] }] }]
            })
        ).then(
            developer => {
                res.locals.timer.markEnd(MARKS.PROCESSING);
                if (developer) {
                    res.locals.timer.recordFunction(MARKS.RENDERING,
                        () => res.render('developer', { developer })
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
