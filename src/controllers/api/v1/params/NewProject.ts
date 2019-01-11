/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/


import { MaxLength, IsString, IsNotEmpty, IsInt, IsPositive } from "class-validator";

import { ENTITY_NAME_MAX_LENGTH, ENTITY_SHORT_DESCRIPTION_MAX_LENGTH } from '../../../../lib/Constants';

/** A new or edited Project */
export class NewProject {

    /** The name of the Project */
    @MaxLength(ENTITY_NAME_MAX_LENGTH, { message: "Name must be less than $constraint1 characters." })
    @IsNotEmpty({ message: "Project must have a Name." })
    @IsString({ message: "Name must be a string." })
    public name!: string;

    /** A short description for the Project */
    @MaxLength(ENTITY_SHORT_DESCRIPTION_MAX_LENGTH, { message: "Short Description must be less than $constraint1 characters." })
    @IsString({ message: "Short Description must be a string." })
    public summary!: string;

    /** A full description for the project */
    @IsString({ message: "Description must be a string." })
    public description!: string;

    /** The team that's working on the project */
    @IsInt({ message: "TeamId must be a positive integer." })
    @IsPositive({ message: "TeamId must be a positive integer." })
    public teamId!: number;

    /** The tags for the project */
    @IsInt({ each: true, message: "TagIds must be an array of positive integers." })
    @IsPositive({ each: true, message: "TagIds must be an array of positive integers." })
    public tagIds!: number[];

}
