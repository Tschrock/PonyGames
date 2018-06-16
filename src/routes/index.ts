/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { Router, Request, NextFunction } from 'express';

import { Project } from '../models/Project';
import { Tag } from '../models/Tag';

import { ITimedResponse, MARKS } from '../lib/RequestTimer';

const router = Router();

/**
 * Compares two tags case-insensitive (TODO: See http://www.i18nguy.com/unicode/turkish-i18n.html)
 * @param a Tag 1
 * @param b Tag 2
 */
function compareTag(a: Tag, b: Tag) {
    const nameA = a.key.toUpperCase(); // ignore upper and lowercase
    const nameB = b.key.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
}

/* GET home page. */
router.get('/', (req: Request, res: ITimedResponse, next: NextFunction) => {
    res.locals.timer.markEnd(MARKS.ROUTING);
    res.locals.timer.markStart(MARKS.PROCESSING);

    res.locals.timer.recordPromise(MARKS.DB,
        () => Project.findAll({ include: [Tag], order: [['name', 'ASC']] })
    ).then(
        projects => {
            projects.forEach(p => p.tags.sort(compareTag));

            res.locals.timer.markEnd(MARKS.PROCESSING);
            res.locals.timer.recordFunction(
                MARKS.RENDERING,
                () => res.render('index', { projects })
            );
        },
        next
    );

});

export = router;
