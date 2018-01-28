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


function getRandomTags(tagGroups: Array<Array<Tag>>) {
    return _.sampleSize(tagGroups, _.random(2, Math.floor(tagGroups.length * 0.7))).map(t => _.sample(t)) as Array<Tag>;
}

function createArr<T>(count: number, builderFunc: (index: number) => PromiseLike<T>) {
    return Promise.all(new Array(count).fill(0).map((_, i) => builderFunc(i)));
}


export async function loadTestData() {
    return new Promise(async (resolve, reject) => {

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
            ['Wine (Platnum)', 'Wine (Silver)', 'Wine (Bronse)', 'Wine (Garbage)'],
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

        const teamDevelopers = await createArr(Math.round(developers.length * 1.2), i => TeamDeveloper.create({
            developerId: (_.sample(developers) as Developer).id,
            teamId: (_.sample(teams) as Team).id
        }));

    });
}
