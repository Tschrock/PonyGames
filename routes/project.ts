import { Router } from 'express';

import { Project } from '../models/Project';
import { HttpError_404_NotFound } from '../lib/HttpError';

const router = Router();

/* GET project page. */
router.get('/:projectId', function(req, res, next) {
  const projectId = +req.params.projectId;
  if (!isNaN(projectId)) {

    Project.findById(projectId).then(
      project => {
        if(project) {
          res.render('project', { project })
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
