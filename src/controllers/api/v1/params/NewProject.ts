/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

'use strict';

import { MaxLength, Min, IsDefined, IsString, IsNumber, Allow } from "class-validator";

/** asdf */
export class NewProject {

    /** asdf */
    @Allow()
    @MaxLength(255, { message: "Name must be less than $constraint1 characters." })
    @IsDefined()
    @IsString()
    public name!: string;

    /** asdf */
    @MaxLength(255, { message: "Short Description must be less than $constraint1 characters." })
    @IsString()
    public shortDescription!: string;

    /** asdf */
    @IsString()
    public description!: string;

    /** asdf */
    @Min(1)
    @IsNumber()
    public teamId!: number;

    /** asdf */
    @IsNumber({ }, { each: true })
    public tags!: number[];

}
