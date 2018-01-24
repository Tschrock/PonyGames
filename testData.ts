//import { Promise } from 'bluebird';

import * as faker from 'faker';
import * as _ from 'lodash';

import { Team } from './models/Team';
import { Project } from './models/Project';
import { Developer } from './models/Developer';
import { TeamDeveloper } from './models/TeamDeveloper';
import { Role } from './models/Role';
import { TeamDeveloperRole } from './models/TeamDeveloperRole';
import { Tag } from './models/Tag';
import { ProjectTag } from './models/ProjectTag';


function createTag(tag: string | string[]): PromiseLike<Tag | Tag[]> {
    if (Array.isArray(tag)) {
        return Promise.all(tag.map(t => Tag.create({ key: t })));
    }
    else {
        return Tag.create({ key: tag });
    }
}

function getRandomTags(tagGroups: Array<Tag | Array<Tag>>) {
    return _.sampleSize(tagGroups, _.random(2, Math.floor(tagGroups.length * 0.7))).map(t => Array.isArray(t) ? _.sample(t) : t) as Array<Tag>;
}

function createArr<T>(count: number, builderFunc: (index: number) => T): Array<T> {
    return new Array(count).fill('').map((_, i) => builderFunc(i));
}


export async function loadTestData() {
    return new Promise(async (resolve, reject) => {

        const tagGroups = await Promise.all([
            ['2D', '2.5D', '3D'],
            'Online',
            'MMO',
            'Multiplayer',
            'Visual Novel',
            'Windows',
            'Mac',
            'Linux',
            'Kickstarted',
            'Open Source',
            'Steam Greenlit',
            ['Wine (Platnum)', 'Wine (Silver)', 'Wine (Bronse)', 'Wine (Garbage)'],
            'Side-Scrolling',
            'Keyboard and Mouse',
            'Gamepad',
            'Touchscreen',
            'Pixel'
        ].map(s => createTag(s)));

        const teams = await Promise.all(createArr(20, t => Team.create({ name: faker.company.companyName() })));
        const projects = await Promise.all(new Array(20).fill(0).map((t, i) => Project.create({ name: faker.commerce.productName(), shortDescription: faker.company.catchPhrase(), description: faker.lorem.paragraph(6), teamId: teams[i].id })));
        const projectTags = await Promise.all(projects.map(p => Promise.all(getRandomTags(tagGroups).map(t => ProjectTag.create({ projectId: p.id, tagId: t.id })))));

    });
}
