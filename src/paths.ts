/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { join as joinPath } from 'path';

export const jsRoot = joinPath(__dirname, '.');
export const modelsRoot = joinPath(jsRoot, 'models');
export const routesRoot = joinPath(jsRoot, 'routes');
export const controllersRoot = joinPath(jsRoot, 'controllers');
export const publicJsRoot = joinPath(jsRoot, 'client');
export const serverRoot = joinPath(jsRoot, '..');
export const publicRoot = joinPath(serverRoot, 'public');
export const viewsRoot = joinPath(serverRoot, 'views');

export const faviconPath = joinPath(publicRoot, 'favicon.ico');
