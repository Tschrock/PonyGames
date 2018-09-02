/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

'use strict';

import { MaxLength, IsString, IsNumber, IsNotEmpty } from "class-validator";

const SHORT_STRING_MAX_CHARS = 255;

/** asdf */
export class NewProject {

    /** asdf */
    @MaxLength(SHORT_STRING_MAX_CHARS, { message: "Name must be less than $constraint1 characters." })
    @IsNotEmpty({ message: "Project must have a Name." })
    @IsString({ message: "Name must be a string." })
    public name!: string;

    /** asdf */
    @MaxLength(SHORT_STRING_MAX_CHARS, { message: "Short Description must be less than $constraint1 characters." })
    @IsString({ message: "Short Description must be a string." })
    public shortDescription!: string;

    /** asdf */
    @IsString({ message: "Description must be a string." })
    public description!: string;

    /** asdf */
    @IsNumber({}, { message: "TeamId must be a number." })
    public teamId!: number;

    /** asdf */
    @IsNumber({ }, { each: true, message: "TagIds must be an array of numbers." })
    public tagIds!: number[];

}
