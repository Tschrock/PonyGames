/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import { Router, Get, Post, Delete, Put, Patch, HttpError, ParseJson, ValidateCsrf } from "../../../lib/cp3-express-decorators";
import { Request, Response, NextFunction } from "express";

import { paginate } from "../../../lib/FindHelper";
import { validate } from "../../../lib/ValidationHelper";

import { Team } from "../../../models/Team";
import { TeamMember } from "../../../models/TeamMember";
import { Developer } from "../../../models/Developer";
import { Project } from "../../../models/Project";

import { NewTeam } from "./params/NewTeam";

import { ProjectsJsonController } from "./ProjectsJsonController";
import { TeamMembersJsonController } from "./TeamMembersJsonController";

/**
 * The controller for the v1 Teams API.
 */
export class FilesJsonController extends Router {


}
