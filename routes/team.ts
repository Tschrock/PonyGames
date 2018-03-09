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
router.get('/:teamId', function (req: Request, res: TimedResponse, next: NextFunction) {
    res.locals.timer.markEnd(MARKS.ROUTING);
    res.locals.timer.markStart(MARKS.PROCESSING);

    const teamId = +req.params.teamId;
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
