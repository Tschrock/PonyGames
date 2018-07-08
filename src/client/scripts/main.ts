/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
'use strict';

interface IErrorResponse {
    message: string;
    data?: {};
}

interface IValidationData {
    property?: string;
    constraints?: { [key:string]:string };
}

document.addEventListener("submit", (eSubmit: Event) => {
    if (eSubmit.target instanceof HTMLFormElement && eSubmit.target.classList.contains('js-ajaxform')) {

        eSubmit.preventDefault();
        const form = eSubmit.target;
        toggleSubmitButton(form, true);
        doJSONRequest(form.getAttribute('method'), form.getAttribute('action'), new FormData(form)).then(
            (eSuccess: Event) => {
                toggleSubmitButton(form, false);
                const xhr = eSuccess.target as XMLHttpRequest;
                console.log(xhr.response);
            },
            (eError: Event) => {
                toggleSubmitButton(form, false);

                let errorMessage = "";

                const xhr = eError.target as XMLHttpRequest;
                if(xhr.status === 400 && xhr.response) {

                    const error = xhr.response as IErrorResponse;
                    if(error.data && Array.isArray(error.data)) {

                        const validationErrors = error.data as IValidationData[];
                        for (const verror of validationErrors) {
                            if(verror.property && verror.constraints) {

                                form.querySelectorAll(`[name=${verror.property}]`).forEach(e => e.classList.add("is-invalid"));
                                for (const c in verror.constraints) {
                                    if (verror.constraints.hasOwnProperty(c)) {
                                        const message = verror.constraints[c];
                                        errorMessage += `${message}<br/>`;
                                    }
                                }

                            }
                        }

                    }
                }

                if(errorMessage === '') {
                    errorMessage = `An unknown error has occured. ${xhr.status}: ${xhr.statusText}`;
                }

                let errorBox = form.querySelector('.js-form-errors');
                if(!errorBox) {
                    errorBox = document.createElement('div');
                    errorBox.classList.add('alert', 'alert-danger');
                    form.insertBefore(errorBox, form.firstChild);
                }

                errorBox.innerHTML = errorMessage;

                console.log(eError);
            },
        );

    }
});

/**
 * Enables/Disables a form's submit button(s).
 * @param form The HTML form.
 * @param disabled If the submit button should be disabled.
 */
function toggleSubmitButton(form: HTMLFormElement, disabled: boolean) {
    form.querySelectorAll("button[type=submit]").forEach(b => (b as HTMLButtonElement).disabled = disabled);
}

/**
 * A promisified XMLHttpRequest using json.
 * @param method The HTTP method.
 * @param action The URI to request.
 * @param data Optional data to include with the request.
 */
async function doJSONRequest(method?: string | null, action?: string | null, data?: FormData) {
    return new Promise<Event>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open(method || 'GET', action || '.');
        xhr.onload = (eLoad: Event) => {
            if (xhr.status >= 200 && xhr.status < 300) resolve(eLoad);
            else reject(eLoad);
        };
        xhr.onerror = reject;
        xhr.send(data);
    });
}
