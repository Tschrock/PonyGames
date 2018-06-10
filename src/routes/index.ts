import { Sequelize } from 'sequelize-typescript';
import { Router, Request, NextFunction } from 'express';

import { Project } from '../models/Project';
import { Tag } from '../models/Tag';
import { ProjectTag } from '../models/ProjectTag';

import { TimedResponse, MARKS } from '../lib/RequestTimer';

const router = Router();

function compareTag(a: Tag, b: Tag) {
    const nameA = a.key.toUpperCase(); // ignore upper and lowercase
    const nameB = b.key.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
}

/* GET home page. */
router.get('/', (req: Request, res: TimedResponse, next: NextFunction) => {
    res.locals.timer.markEnd(MARKS.ROUTING);
    res.locals.timer.markStart(MARKS.PROCESSING);

    res.locals.timer.recordPromise(MARKS.DB,
        () => Project.findAll({ include: [Tag], order: [['name', 'ASC']] })
    ).then(
        projects => {
            projects.forEach(p => p.tags.sort(compareTag));

            res.locals.timer.markEnd(MARKS.PROCESSING);
            res.locals.timer.recordFunction(MARKS.RENDERING,
                () => res.render('index', { projects })
            )
        },
        error => next(error)
    );

});

export = router;
