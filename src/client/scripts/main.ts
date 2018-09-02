/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
'use strict';

/*----------- #notjquery -----------*/
const $ = (x: string) => document.querySelector(x);
const $$ = (x: string) => document.querySelectorAll(x);
const $on = (types: string, selector: string, handler: (x: Event) => void) => types.split(' ').forEach(t => document.addEventListener(t, e => { if ((e.target as HTMLElement).matches(selector)) handler(e); }));
const $execAll = (input: string, regex: RegExp, each: (x: RegExpExecArray) => void) => { let match; while (match = regex.exec(input)) each(match); };
const $new = (type: string, ...content: (string | HTMLElement)[]) => {
    let e!: HTMLElement;
    $execAll(type, /([#.]?)([^#.]+)/g, ([_, x, y]) => {
        if (!e) e = document.createElement(!x ? y : 'div');
        if (x === '.') e.classList.add(y);
        if (x === '#') e.id = y;
    });
    (e as any).append(...content);
    return e;
};

/*----------- HTTP Helpers -----------*/

/**
 * The API's error response
 */
interface IErrorResponse {
    message: string;
    data?: {};
}

/**
 * API request validation data (returned from a bad request)
 */
interface IValidationData {
    property: string;
    constraints: { [key: string]: string };
}

/**
 * Common status codes
 */
enum HttpStatus {
    SUCCESS = 200,
    CREATED = 201,
    RESET_CONTENT = 205,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}


/*----------- Form Helpers -----------*/

/**
 * Enables/Disables a form's submit button(s).
 * @param form The HTML form elenemt.
 * @param disabled If the submit button should be disabled.
 */
function disableSubmitBtn(form: HTMLFormElement, disabled = true) {
    form.querySelectorAll("button[type=submit]").forEach(b => (b as HTMLButtonElement).disabled = disabled);
}

type FormControlElement = HTMLButtonElement | HTMLFieldSetElement | HTMLInputElement | HTMLObjectElement | HTMLOutputElement | HTMLSelectElement | HTMLTextAreaElement;

type FormJsonDataType = string | number;

/**
 * Gets the value of a form element.
 * @param field The form field.
 */
function getFormFieldValue(field: FormControlElement): FormJsonDataType | Array<FormJsonDataType> {
    if ('selectedOptions' in field) return field.selectedOptions.length > 1 ? Array.from(field.selectedOptions).map(getFormattedValue) : getFormattedValue(field);
    if ('value' in field) return getFormattedValue(field);
    return "";
}

/**
 * Gets the formatted Value for an element
 * @param element The element
 */
function getFormattedValue(element: HTMLElement & {value: string}): FormJsonDataType {
    let definedType;
    for(let e: HTMLElement | Element |  null = element; e; e = e.parentElement) {
        if('dataset' in e && (definedType = e.dataset["valueType"])) break;
        if(e.tagName === 'form') break;
    }
    switch (definedType) {
        case "number":
            return +element.value;
        default:
            return element.value;
    }
}

/**
 * Attempts to jsonify a form. Files are not included.
 * @param form The HTML form elenemt.
 */
function jsonifyForm(form: HTMLFormElement): object {

    // Object for our form values
    const values: { [key: string]: FormJsonDataType | Array<FormJsonDataType> } = {};

    // Get all the relevant form controls
    const formControls = form.elements;

    // Look through each one
    for (const formControl of formControls) {
        const field = formControl as FormControlElement;

        // If it has a name and isn't disabled
        if (
            ('name' in field && field.name)
            && ('disabled' in field && !field.disabled)
            && ( !(field instanceof HTMLInputElement && field.type === 'checkbox') || field.checked)
        ) {
            const newValue = getFormFieldValue(field);

            // Check if we already have a value with he same name
            if (field.name in values) {
                const oldValue = values[field.name];

                const oldValueArray = Array.isArray(oldValue) ? oldValue : [oldValue];
                const newValueArray = Array.isArray(newValue) ? newValue : [newValue];

                values[field.name] = oldValueArray.concat(newValueArray);
            }
            else {
                values[field.name] = newValue;
            }
        }
    }

    return values;
}

enum AlertType {
    SUCCESS = 'alert-success',
    WARNING = 'alert-warning',
    DANGER = 'alert-danger'
}

/**
 * Shows an alert on a form.
 * @param form The HTML form element.
 * @param type The type of alert.
 * @param title The title of the alert.
 * @param message The message of the alert.
 * @param validationErrors Optional validation errors to highlight.
 */
function showFormAlert(form: HTMLFormElement, type: AlertType, title: string, message: string, validationErrors?: Array<IValidationData>) {

    // Get the alert box (or create one and insert it if it doesn't exist).
    const alertBox = form.querySelector(".alert.form-alert") || form.insertBefore($new('.alert.form-alert'), form.firstChild);

    // Clear any current alerts and highlights
    Object.values(AlertType).forEach((t: string) => alertBox.classList.remove(t));
    while (alertBox.firstChild) alertBox.removeChild(alertBox.firstChild);
    form.querySelectorAll(".invalid").forEach(e => e.classList.remove("invalid"));

    // Add the new content and highlights
    alertBox.classList.add(type);
    alertBox.appendChild($new('h3', title));
    alertBox.appendChild($new('p', message));
    if (validationErrors && Array.isArray(validationErrors)) {

        const messageListList = validationErrors.map(err => err.constraints ? Object.values(err.constraints) : []);
        const messageList = Array.prototype.concat.call([], ...messageListList) as string[];
        const listItems = messageList.map(m => $new('li', m));
        alertBox.appendChild($new('ul', ...listItems));

        validationErrors.forEach(err => {
            const elements = form.elements.namedItem(err.property);
            if (elements instanceof Element) {
                elements.classList.add("invalid");
            }
            else if (elements instanceof RadioNodeList) {
                elements.forEach(el => (el as Element).classList.add("invalid"));
            }
        });
    }

}

/**
 * On form submission
 */
$on("submit", ".js-ajaxform", e => {

    // Override the default handling
    e.preventDefault();

    // Get the form
    const form = e.target as HTMLFormElement;

    // Disable any submit buttons to prevent double-submissions
    disableSubmitBtn(form);

    const submitAction = form.getAttribute('action') || '.';
    const submitMethod = form.getAttribute('method') || 'GET';

    // Use fetch to send the request
    fetch(submitAction, {
        method: submitMethod,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonifyForm(form))
    }).then(
        response => {
            // Re-enable the submit buttons
            disableSubmitBtn(form, false);

            // Check the response status
            if (response.ok) {
                switch (response.status) {
                    case HttpStatus.CREATED:
                        //  The form was subitted successfully and a new resource was created
                        showFormAlert(form, AlertType.SUCCESS, "Success", `Your information was submitted successfully.`);
                        const createdLocation = response.headers.get("Location");
                        if (createdLocation) window.location.replace(createdLocation);
                        break;
                    case HttpStatus.RESET_CONTENT:
                        //  The form was subitted successfully and should be cleared to allow a new submission
                        showFormAlert(form, AlertType.SUCCESS, "Success", `Your information was submitted successfully.`);
                        form.reset();
                        break;
                    default:
                        showFormAlert(form, AlertType.SUCCESS, "Success", `Your information was submitted successfully.`);
                        break;
                }
                const successLocation = form.dataset["successLocation"];
                if(successLocation) window.location.replace(successLocation);
            }
            else {
                // Try to parse the error data
                response.json().then(
                    (errorData: IErrorResponse) => {

                        // Friendly error messages
                        switch (response.status) {
                            case HttpStatus.BAD_REQUEST:
                                showFormAlert(form, AlertType.WARNING, "Error", `Please fix the indicated fields and try again.`, errorData.data as Array<IValidationData>);
                                break;
                            case HttpStatus.INTERNAL_SERVER_ERROR:
                                showFormAlert(form, AlertType.DANGER, "Error", `The server encountered an internal error while processing your request. This is probably a bug. ${errorData.message}`);
                                break;
                            case HttpStatus.UNAUTHORIZED:
                                showFormAlert(form, AlertType.DANGER, "Access Denied", `You don't have permission to do that. ${errorData.message}`);
                                break;
                            default:
                                showFormAlert(form, AlertType.DANGER, "Error", `An unknown error occured with your submission, please try again later. Response Code: ${response.status} ${response.statusText}`);
                                break;
                        }
                    },
                    (parseError: Error) => {
                        showFormAlert(form, AlertType.DANGER, "Error", `An unknown error occured with your submission, please try again later. Response Code: ${response.status} ${response.statusText}`);
                    }
                );
            }
        },
        (networkerror: Error) => {
            disableSubmitBtn(form, false);
            showFormAlert(form, AlertType.DANGER, "Network Error", `A network error prevented your form from being submitted, please try again later. ${networkerror.message}`);
        }
    );

});

// /**
//  * A promisified XMLHttpRequest using json.
//  * @param method The HTTP method.
//  * @param action The URI to request.
//  * @param data Optional data to include with the request.
//  */
// async function doJSONRequest(method?: string | null, action?: string | null, data?: FormData) {
//     return new Promise<Event>((resolve, reject) => {
//         const xhr = new XMLHttpRequest();
//         xhr.responseType = 'json';
//         xhr.open(method || 'GET', action || '.');
//         xhr.onload = (eLoad: Event) => {
//             if (xhr.status >= 200 && xhr.status < 300) resolve(eLoad);
//             else reject(eLoad);
//         };
//         xhr.onerror = reject;
//         xhr.send(data);
//     });
// }
