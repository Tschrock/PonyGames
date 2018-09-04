/*!
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

'use strict';

import { MaxLength, IsString, IsInt, IsPositive } from "class-validator";

import { SHORT_STRING_MAX_LENGTH } from '../../../../lib/Constants';

/** A new TeamMember */
export class NewTeamMember {

    /** The Team id */
    @IsInt({ message: "DeveloperId must be a positive integer." })
    @IsPositive({ message: "DeveloperId must be a positive integer." })
    public teamId!: number;

    /** The Developer id */
    @IsInt({ message: "DeveloperId must be a positive integer." })
    @IsPositive({ message: "DeveloperId must be a positive integer." })
    public developerId!: number;

    /** A short description for the TeamMember */
    @MaxLength(SHORT_STRING_MAX_LENGTH, { message: "Roles must be less than $constraint1 characters." })
    @IsString({ message: "Roles must be a string." })
    public roles!: string;

}
