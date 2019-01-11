/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { performance } from 'perf_hooks'; // tslint:disable-line:no-implicit-dependencies

import { Request, Response, NextFunction } from 'express';

export interface ITimedResponse extends Response {
    locals: {
        timer: RequestTimer;
        [x: string]: {};
    };
}

interface ITimerMark {
    key: string;
    time: number;
    type: 'start' | 'end';
}

export enum MARKS {
    REQUEST = 'request',
    MIDDLEWARE = 'middleware',
    ROUTING = 'routing',
    PROCESSING = 'processing',
    DB = 'db',
    RENDERING = 'rendering'
}

/**
 * Times a request.
 */
export class RequestTimer {

    /** The current timeline. */
    private readonly timeline: Array<ITimerMark> = [];

    /**
     * Gets a copy of current timeline.
     */
    public getAllMarks(): Array<ITimerMark> {
        return this.timeline.map(({key, time, type}) => ({ key, time, type }));
    }

    /**
     * Returns if the timeline has a mark with the given key.
     * @param key The key of the mark to find in the timeline.
     */
    public hasMark(key: string) {
        return this.timeline.some(m => m.key === key);
    }

    /**
     * Returns if the timeline has a mark with the given key and type.
     * @param key The key of the mark to find in the timeline.
     * @param type The type of mark to find in the timeline.
     */
    public hasMarkOfType(key: string, type: 'start' | 'end') {
        return this.timeline.some(m => m.key === key && m.type === type);
    }

    /**
     * Makes a start mark with the given key.
     * @param key The key of the mark to start.
     */
    public markStart(key: string) {
        this.timeline.push({ key, time: performance.now(), type: 'start' });
    }

    /**
     * Makes an end mark with the given key.
     * @param key The key of the mark to end.
     */
    public markEnd(key: string) {
        this.timeline.push({ key, time: performance.now(), type: 'end' });
    }

    /**
     * Times a function and marks it's start and end times.
     * @param key The key for the mark to record.
     * @param func The function to record.
     */
    public recordFunction<T>(key: string, func: () => T) {
        this.markStart(key);
        const rtn = func.call(null) as T;
        this.markEnd(key);
        return rtn;
    }

    /**
     * Times a promise and marks it's start and end times.
     * @param key The key for the mark to record.
     * @param func A function that returs a promise to record.
     */
    public recordPromise<T>(key: string, func: () => PromiseLike<T>) {
        this.markStart(key);
        return func().then(
            rtn => {
                this.markEnd(key);
                return rtn;
            }
        );
    }

    /**
     * Returns the total duration of a key.
     * @param key The key for the mark.
     */
    public getDurationOf(key: string) {
        let totalDuration: number = 0;
        const startItems: Array<ITimerMark> = [];
        for(const item of this.timeline) {
            if(item.type === 'start' && item.key === key) {
                startItems.push(item);
            }
            else if (item.type === 'end' && item.key === key) {
                const startItem = startItems.pop();
                if(startItem) {
                    totalDuration += item.time - startItem.time;
                }
            }
        }

        const now = performance.now();
        for(const item of startItems) {
            totalDuration += now - item.time;
        }

        return totalDuration;
    }

}

/**
 * Times an http request.
 * @param req The Request.
 * @param res The Response.
 * @param next The Next function.
 */
export function timeRequest(req: Request, res: ITimedResponse, next: NextFunction) {
    res.locals.timer = new RequestTimer();
    res.locals.timer.markStart(MARKS.REQUEST);
    res.locals.timer.markStart(MARKS.ROUTING);
    res.on("finish", () => {
        if(!res.locals.timer.hasMarkOfType(MARKS.ROUTING, 'end')) {
            res.locals.timer.markEnd(MARKS.ROUTING);
        }
        res.locals.timer.markEnd(MARKS.REQUEST);
        // console.log(res.locals.timer.getAllMarks());
    });
    next();
}

/**
 * Times a middleware function.
 * @param fn The middleware function.
 */
export function timeMiddleware(fn: (req: Request, res: ITimedResponse, next: NextFunction) => void) {
    const markName = `${MARKS.MIDDLEWARE}-${fn.name}`;
    return (req: Request, res: ITimedResponse, next: NextFunction) => {
        res.locals.timer.markStart(markName);
        const doNext: NextFunction = rtn => {
            res.locals.timer.markEnd(markName);
            next.apply(void 0, [rtn]);
        };
        fn.apply(void 0, [req, res, doNext]);
    };
}
