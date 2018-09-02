/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

'use strict';

import { MaxLength, IsString, IsNotEmpty } from "class-validator";

const SHORT_STRING_MAX_CHARS = 255;

/** asdf */
export class NewDeveloper {

    /** asdf */
    @MaxLength(SHORT_STRING_MAX_CHARS, { message: "Name must be less than $constraint1 characters." })
    @IsNotEmpty({ message: "Developer must have a Name." })
    @IsString({ message: "Name must be a string." })
    public name!: string;

    /** asdf */
    @MaxLength(SHORT_STRING_MAX_CHARS, { message: "Short Description must be less than $constraint1 characters." })
    @IsString({ message: "Short Description must be a string." })
    public shortDescription!: string;

    /** asdf */
    @IsString({ message: "Description must be a string." })
    public description!: string;

}
