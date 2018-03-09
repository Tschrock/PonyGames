import { performance } from 'perf_hooks';

import { Request, Response, NextFunction } from 'express';

export interface TimedResponse extends Response {
    locals: { timer: RequestTimer, [x: string]: any };
}

interface TimerMark {
    key: string;
    time: number;
    type: 'start' | 'end'
}

export enum MARKS {
    REQUEST = 'request',
    ROUTING = 'routing',
    PROCESSING = 'processing',
    DB = 'db',
    RENDERING = 'rendering'
}

export class RequestTimer {

    private timeline: Array<TimerMark> = [];

    getAllMarks() {
        return this.timeline.map(({key, time, type}) => ({ key, time, type }));
    }

    hasMark(key: string) {
        return this.timeline.some(m => m.key === key);
    }

    hasMarkOfType(key: string, type: 'start' | 'end') {
        return this.timeline.some(m => m.key === key && m.type === type);
    }

    markStart(key: string) {
        this.timeline.push({ key, time: performance.now(), type: 'start' });
    }

    markEnd(key: string) {
        this.timeline.push({ key, time: performance.now(), type: 'end' });
    }

    recordFunction<T>(key: string, func: () => T) {
        this.markStart(key);
        const rtn: T = func.call(null);
        this.markEnd(key);
        return rtn;
    }

    recordPromise<T>(key: string, func: () => PromiseLike<T>) {
        this.markStart(key);
        return func().then(
            rtn => {
                this.markEnd(key);
                return rtn;
            }
        )
    }

    getDurationOf(key: string) {
        var totalDuration: number = 0;
        var startItems: Array<TimerMark> = [];
        for(let item of this.timeline) {
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
        for(let item of startItems) {
            totalDuration += now - item.time;
        }
        
        return totalDuration;
    }

}

export function timeRequest(req: Request, res: TimedResponse, next: NextFunction) {
    res.locals.timer = new RequestTimer();

    res.locals.timer.markStart(MARKS.REQUEST);
    res.locals.timer.markStart(MARKS.ROUTING);
    res.on("finish", () => {
        if(!res.locals.timer.hasMarkOfType(MARKS.ROUTING, 'end')) {
            res.locals.timer.markEnd(MARKS.ROUTING);
        }
        res.locals.timer.markEnd(MARKS.REQUEST);
        console.log(res.locals.timer.getAllMarks())
    });
    next();
}
