import { Router, Request, NextFunction } from 'express';

import { HttpError_404_NotFound } from '../lib/HttpError';
import { Tag } from '../models/Tag';
import { Team } from '../models/Team';
import { Developer } from '../models/Developer';
import { TeamDeveloper } from '../models/TeamDeveloper';
import { Project } from '../models/Project';

import { TimedResponse, MARKS } from '../lib/RequestTimer';

const router = Router();

/* GET project page. */
router.get('/:developerId', function (req: Request, res: TimedResponse, next: NextFunction) {
    res.locals.timer.markEnd(MARKS.ROUTING);
    res.locals.timer.markStart(MARKS.PROCESSING);

    const developerId = +req.params.developerId;
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
                    next(new HttpError_404_NotFound());
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
        next(new HttpError_404_NotFound());
    }
});

export = router;
