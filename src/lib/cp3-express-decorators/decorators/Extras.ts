/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { randomBytes, timingSafeEqual } from 'crypto';

import { json as buildJsonParser } from 'body-parser';
import { Request, Response, NextFunction } from 'express';

import { UseBefore } from './UseBefore';

export function GenerateCsrf() { return UseBefore(doGenerateCsrf) }
export function ValidateCsrf() { return UseBefore(doValidateCsrf) }
export function ParseJson() { return UseBefore(doParseJson) }

export function doGenerateCsrf(req: Request, res: Response, next: NextFunction) {
    if (req.session && !("csrfToken" in req.session)) req.session.csrfToken = randomBytes(32).toString('hex');
    next();
}

function getCsrfFrom(thing: any): string | null {
    return (thing && "csrfToken" in thing) ? thing.csrfToken : null;
}

export function doValidateCsrf(req: Request, res: Response, next: NextFunction) {
    const sessToken = getCsrfFrom(req.session);
    const bodyToken = getCsrfFrom(req.body);
    if( (req as any).skipCsrf || (sessToken !== null && bodyToken !== null && timingSafeEqual(Buffer.from(sessToken, 'utf8'), Buffer.from(bodyToken, 'utf8')))) next()
    else throw new Error("Invalid CSRF Token");
}


export const doParseJson = buildJsonParser({ verify: (req, res, buf) => {
    return (req as any).rawBody = buf.toString();
} });
