import { Router, Request, NextFunction } from 'express';
import * as httpError from 'http-errors';

import { Project } from '../models/Project';
import { Tag } from '../models/Tag';
import { Team } from '../models/Team';
import { Developer } from '../models/Developer';
import { TeamDeveloper } from '../models/TeamDeveloper';

import { TimedResponse, MARKS } from '../lib/RequestTimer';

const router = Router();

/* GET project page. */
router.get('/:projectId', function (req: Request, res: TimedResponse, next: NextFunction) {
    res.locals.timer.markEnd(MARKS.ROUTING);
    res.locals.timer.markStart(MARKS.PROCESSING);

    const projectId = +req.params.projectId;
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
        )
    }
    else {
        res.locals.timer.markEnd(MARKS.PROCESSING);
        next(new httpError.NotFound());
    }
});

export = router;
