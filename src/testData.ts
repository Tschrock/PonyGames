/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/* tslint:disable:no-implicit-dependencies no-magic-numbers*/

import * as faker from 'faker';
import * as _ from 'lodash';

import { Team } from './models/Team';
import { Project } from './models/Project';
import { Developer } from './models/Developer';
import { TeamMember } from './models/TeamMember';
import { Tag } from './models/Tag';
import { ProjectTag } from './models/ProjectTag';

/**
 * Gets a random set of tags.
 * @param tagGroups An array of tag groups.
 */
function getRandomTags(tagGroups: Array<Array<Tag>>) {
    return _.sampleSize(tagGroups, _.random(2, Math.floor(tagGroups.length * 0.7))).map(t => _.sample(t)) as Array<Tag>;
}

/**
 * Creates an array.
 * @param count The number of indexes to create.
 * @param builderFunc A function to map for each index.
 */
async function createArr<T>(count: number, builderFunc: (index: number) => PromiseLike<T>) {
    return Promise.all(new Array(count).fill(0).map((x, i) => builderFunc(i)));
}

/**
 * Fills the database with randomly-generated test data.
 */
export async function loadTestData() {
    return new Promise<void>(async (resolve, reject) => {

        const tagGroups = await Promise.all([
            ['2D', '2.5D', '3D'],
            ['Online'],
            ['MMO'],
            ['Multiplayer'],
            ['Visual Novel'],
            ['Windows'],
            ['Mac'],
            ['Linux'],
            ['Kickstarted'],
            ['Open Source'],
            ['Steam Greenlit'],
            ['Wine (Platnum)', 'Wine (Silver)', 'Wine (Bronze)', 'Wine (Garbage)'],
            ['Side-Scrolling'],
            ['Keyboard and Mouse'],
            ['Gamepad'],
            ['Touchscreen'],
            ['Pixel']
        ].map(s => Promise.all(s.map(t => Tag.create({ key: t })))));

        const teams = await createArr(20, t => Team.create({
            name: faker.company.companyName(),
            shortDescription: faker.company.catchPhrase(),
            description: faker.lorem.paragraphs(3)
        }));

        const projects = await createArr(teams.length, i => Project.create({
            name: faker.commerce.productName(),
            shortDescription: faker.company.catchPhrase(),
            description: faker.lorem.paragraphs(3),
            teamId: teams[i].id
        }));

        const projectTags = await createArr(projects.length, i => Promise.all(
            getRandomTags(tagGroups)
            .map(t => ProjectTag.create({
                projectId: projects[i].id,
                tagId: t.id
            }))
        ));

        const developers = await createArr(teams.length * 4, i => Developer.create({
            name: faker.name.findName(),
            shortDescription: faker.company.catchPhrase(),
            description: faker.lorem.paragraphs(2)
        }));

        const teamMembers = await createArr(Math.round(developers.length * 1.2), i => TeamMember.create({
            developerId: (_.sample(developers) as Developer).id,
            teamId: (_.sample(teams) as Team).id
        }));

    });
}
