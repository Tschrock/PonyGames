/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


import { validate as originalValidate, ValidatorOptions } from "class-validator";
import { HttpError } from "cp3-express-decorators";

/**
 * Validates an object.
 * @param object The object to validate.
 * @param validatorOptions The validation options.
 */
export function validate(object: Object, validatorOptions?: ValidatorOptions): PromiseLike<void> {
    return originalValidate(object, { whitelist: true, validationError: { target: false, value: false }, ...validatorOptions}).then(
        validationErrors => {
            if (validationErrors.length > 0) return Promise.reject(new HttpError(400, "Bad Request", validationErrors));
            else return Promise.resolve();
        }
    );
}
