#!/usr/bin/env node
/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

import { HttpError as HttpError_HE } from 'http-errors';
import { HttpError as HttpError_RC } from "routing-controllers";

export type AnyError = Error | HttpError_HE | HttpError_RC | HttpError;

export interface IErrorResponse {
    message: string;
    data?: {};
    stack?: string;
    causedBy?: IErrorResponse;
}

/**
 * A generic http error that can be safely converted into a client message.
 */
export class HttpError extends Error {

    /** The status code to serve this error with. */
    public statusCode: number;

    /** Extra data to be sent with this error. */
    public data?: {};

    /** The Error that caused this error. */
    public causedBy?: Error;

    constructor(statusCode: number, message: string, data?: {}, causedBy?: Error) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.causedBy = causedBy;
    }

    /**
     * Returns a simple object representing this error that can be returned to the client.
     * @param allowSensitive If the object should contain sensitive information.
     */
    public toResponseObject(allowSensitive: boolean = false): IErrorResponse {
        return errorToResponse(allowSensitive, this);
    }

}

/**
 * Normalizes an error into a custom HttpError.
 * @param error Any web request error.
 */
export function normalizeError(error: AnyError): HttpError {

    if (error instanceof HttpError) {
        return error;
    }
    else if (error instanceof HttpError_HE) {
        return new HttpError(error.status, error.message, undefined, error);
    }
    else if (error instanceof HttpError_RC) {
        return new HttpError(error.httpCode, error.message, undefined, error);
    }
    else {
        return new HttpError(500, error.message, undefined, error);
    }

}

/** asdf */
function errorToResponse(allowSensitive: boolean, error: AnyError): IErrorResponse {

    const response: IErrorResponse = { message: error.message };
    if (allowSensitive) response.stack = error.stack;
    if(error instanceof HttpError) response.data = error.data;
    if (allowSensitive && error instanceof HttpError && error.causedBy) response.causedBy = errorToResponse(allowSensitive, error.causedBy);

    return response;

}

