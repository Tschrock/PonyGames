import { Router } from 'express';

import { HttpError_404_NotFound } from '../lib/HttpError';
import { Tag } from '../models/Tag';
import { Team } from '../models/Team';
import { Developer } from '../models/Developer';
import { TeamDeveloper } from '../models/TeamDeveloper';
import { Project } from '../models/Project';

const router = Router();

/* GET project page. */
router.get('/:teamId', function (req, res, next) {
    const teamId = +req.params.teamId;
    if (!isNaN(teamId)) {

        Team.findById(teamId, {
            include: [{ model: TeamDeveloper, include: [ Developer ] }, Project]
        }).then(
            team => {
                if (team) {
                    res.render('team', { team })
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
