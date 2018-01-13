import { Sequelize } from 'sequelize-typescript';
import { Router } from 'express';

import { Project } from '../models/Project';
import { Tag } from '../models/Tag';
import { ProjectTag } from '../models/ProjectTag';

const router = Router();

function compareTag(a: Tag, b: Tag) {
    var nameA = a.key.toUpperCase(); // ignore upper and lowercase
    var nameB = b.key.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
}

/* GET home page. */
router.get('/', function (req, res, next) {

    Project.findAll({ include: [ Tag ], order: [['name', 'ASC']] }).then(
        projects => {
            projects.forEach(p => p.tags.sort(compareTag));
            res.render('index', { projects });
        },
        error => next(error)
    );

});

export = router;
