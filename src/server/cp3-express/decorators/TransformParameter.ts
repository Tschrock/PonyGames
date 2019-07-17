/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ValueTransformer, registerParameterTransform } from "../TransformerUtils";
import { NextFunction, Response, Request } from "express";

export function TransformParameter<TIn, TOut>(transform: ValueTransformer<TIn, [Request, Response, NextFunction], TOut>): ParameterDecorator {
    return (target: Object, propertyKey: string | symbol, parameterIndex: number): void => {

        const prototype = typeof target === "function" ? target.prototype : target;
        registerParameterTransform(prototype, propertyKey, parameterIndex, transform);

    };
}

export function RouteParam(parameter: string): ParameterDecorator {
    return TransformParameter<null, string>((input, req, res, next) => {
        return req.params[parameter];
    });
}

export function QueryParam(parameter: string): ParameterDecorator {
    return TransformParameter<null, string>((input, req, res, next) => {
        return req.query[parameter];
    });
}

export function BodyParam(parameter: string): ParameterDecorator {
    return TransformParameter((input, req, res, next) => {
        return req.body[parameter];
    });
}

export function Body(): ParameterDecorator {
    return TransformParameter((input, req, res, next) => {
        return req.body;
    });
}

export function Req(): ParameterDecorator {
    return TransformParameter((input, req, res, next) => {
        return req;
    });
}

export function Res(): ParameterDecorator {
    return TransformParameter((input, req, res, next) => {
        return res;
    });
}

export function Next(): ParameterDecorator {
    return TransformParameter((input, req, res, next) => {
        return next;
    });
}
