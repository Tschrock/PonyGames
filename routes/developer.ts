import { Router } from 'express';

import { HttpError_404_NotFound } from '../lib/HttpError';
import { Tag } from '../models/Tag';
import { Team } from '../models/Team';
import { Developer } from '../models/Developer';
import { TeamDeveloper } from '../models/TeamDeveloper';
import { Project } from '../models/Project';

const router = Router();

/* GET project page. */
router.get('/:developerId', function (req, res, next) {
    const developerId = +req.params.developerId;
    if (!isNaN(developerId)) {

        Developer.findById(developerId, {
            include: [{ model: TeamDeveloper, include: [ { model: Team, include: [ Project ] } ] }]
        }).then(
            developer => {
                if (developer) {
                    res.render('developer', { developer })
                }
                else {
                    next(new HttpError_404_NotFound());
                }
            },
            error => next(error)
            )
    }
    else {
        next(new HttpError_404_NotFound());
    }
});

export = router;
