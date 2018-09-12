/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

'use strict';

import { MaxLength, IsString, IsNotEmpty } from "class-validator";

import { ENTITY_NAME_MAX_LENGTH, ENTITY_SHORT_DESCRIPTION_MAX_LENGTH } from '../../../../lib/Constants';

/** A new or edited Developer */
export class NewDeveloper {

    /** The Developer's name */
    @MaxLength(ENTITY_NAME_MAX_LENGTH, { message: "Name must be less than $constraint1 characters." })
    @IsNotEmpty({ message: "Developer must have a Name." })
    @IsString({ message: "Name must be a string." })
    public name!: string;

    /** A short description for the Developer */
    @MaxLength(ENTITY_SHORT_DESCRIPTION_MAX_LENGTH, { message: "Short Description must be less than $constraint1 characters." })
    @IsString({ message: "Short Description must be a string." })
    public shortDescription!: string;

    /** A full description for the Developer */
    @IsString({ message: "Description must be a string." })
    public description!: string;

}