/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import typescript from 'typescript';
import { BrowserifyObject } from 'browserify';

interface TsifyOptions {
    project?: string;
}

declare const tsify: (b: BrowserifyObject, opts: TsifyOptions) => void;

export = tsify;
