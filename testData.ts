//import { Promise } from 'bluebird';

import { Team } from './models/Team';
import { Project } from './models/Project';
import { Developer } from './models/Developer';
import { TeamDeveloper } from './models/TeamDeveloper';
import { Role } from './models/Role';
import { TeamDeveloperRole } from './models/TeamDeveloperRole';
import { Tag } from './models/Tag';
import { ProjectTag } from './models/ProjectTag';

export async function loadTestData() {
    return new Promise(async (resolve, reject) => {

        const tags = await Promise.all([
            /* 00 */ { key: '2D' },
            /* 01 */ { key: '3D' },
            /* 02 */ { key: '2.5D' },
            /* 03 */ { key: 'Online' },
            /* 04 */ { key: 'MMO' },
            /* 05 */ { key: 'Unity' },
            /* 06 */ { key: 'Multiplayer' },
            /* 07 */ { key: 'Flash' },
            /* 08 */ { key: 'Java' },
            /* 09 */ { key: 'Visual Novel' },
            /* 10 */ { key: 'Windows' },
            /* 11 */ { key: 'Mac' },
            /* 12 */ { key: 'Linux' },
            /* 13 */ { key: 'Kickstarted' },
            /* 14 */ { key: 'Open Source' },
            /* 15 */ { key: 'Steam Greenlit' },
            /* 16 */ { key: 'Wine-Platnum' },
            /* 17 */ { key: 'Wine-Silver' },
            /* 18 */ { key: 'Wine-Bronse' },
            /* 19 */ { key: 'Side-Scrolling' },
            /* 20 */ { key: 'Keyboard and Mouse' },
            /* 21 */ { key: 'Gamepad' },
            /* 22 */ { key: 'Touchscreen' },
            /* 23 */ { key: 'Pixel' },
            /* 24 */ { key: 'Wine-Garbage' },
        ].map(v => Tag.create(v)));

        const teams = await Promise.all([
            /* 00 */ { name: 'Legends of Equestria' },
            /* 01 */ { name: 'EQUIDEV' },
            /* 02 */ { name: 'Sulphur Nimbus: Hel\'s Elixir' },
            /* 03 */ { name: 'Nia: Path of Light' },
            /* 04 */ { name: 'Pony Age: Chronicles' },
            /* 05 */ { name: 'Ambient: White' },
            /* 06 */ { name: 'Equestrian Dreamers' },
            /* 07 */ { name: 'The Overmare Studios' },
            /* 08 */ { name: 'Fighting is Magic' },
            /* 09 */ { name: 'Friendship is Epic' },
            /* 10 */ { name: 'My Little Pony: Rise of the Clockwork Stallions' }
        ].map(v => Team.create(v)));

        const projects = await Promise.all([
            /* 00 */ { name: 'Legends of Equestria', shortDescription: 'A fan-made 3D free-to-play pony MMORPG.', teamId: teams[0].id },
            /* 01 */ { name: 'HorseGame', teamId: teams[1].id },
            /* 02 */ { name: 'Sulphur Nimbus: Hel\'s Elixir', teamId: teams[2].id },
            /* 03 */ { name: 'Nia: Path of Light', teamId: teams[3].id },
            /* 04 */ { name: 'Pony Age: Chronicles', teamId: teams[4].id },
            /* 05 */ { name: 'Ambient: White', teamId: teams[5].id },
            /* 06 */ { name: 'My Little Investigations', teamId: teams[6].id },
            /* 07 */ { name: 'Ashes of Equestria', teamId: teams[7].id },
            /* 08 */ { name: 'Fighting is Magic', teamId: teams[8].id },
            /* 09 */ { name: 'Friendship is Epic', teamId: teams[9].id },
            /* 10 */ { name: 'My Little Pony: Rise of the Clockwork Stallions', teamId: teams[10].id },
        ].map(v => Project.create(v)));

        const projectTags = [
            { projectId: projects[0].id, tagId: tags[1].id },
            { projectId: projects[0].id, tagId: tags[3].id },
            { projectId: projects[0].id, tagId: tags[4].id },
            { projectId: projects[0].id, tagId: tags[5].id },
            { projectId: projects[0].id, tagId: tags[6].id },
            { projectId: projects[0].id, tagId: tags[10].id },
            { projectId: projects[0].id, tagId: tags[11].id },
            { projectId: projects[0].id, tagId: tags[12].id },
            { projectId: projects[0].id, tagId: tags[20].id },

            { projectId: projects[1].id, tagId: tags[1].id },
            { projectId: projects[1].id, tagId: tags[5].id },
            { projectId: projects[1].id, tagId: tags[10].id },
            { projectId: projects[1].id, tagId: tags[11].id },
            { projectId: projects[1].id, tagId: tags[12].id },
            { projectId: projects[1].id, tagId: tags[20].id },
            
            { projectId: projects[2].id, tagId: tags[1].id },
            { projectId: projects[2].id, tagId: tags[8].id },
            { projectId: projects[2].id, tagId: tags[10].id },
            { projectId: projects[2].id, tagId: tags[11].id },
            { projectId: projects[2].id, tagId: tags[12].id },
            { projectId: projects[2].id, tagId: tags[13].id },
            { projectId: projects[2].id, tagId: tags[14].id },
            { projectId: projects[2].id, tagId: tags[20].id },

            { projectId: projects[3].id, tagId: tags[1].id },
            { projectId: projects[3].id, tagId: tags[10].id },
            { projectId: projects[3].id, tagId: tags[15].id },
            { projectId: projects[3].id, tagId: tags[20].id },

            { projectId: projects[4].id, tagId: tags[2].id },
            { projectId: projects[4].id, tagId: tags[3].id },
            { projectId: projects[4].id, tagId: tags[4].id },
            { projectId: projects[4].id, tagId: tags[5].id },
            { projectId: projects[4].id, tagId: tags[6].id },
            { projectId: projects[4].id, tagId: tags[10].id },
            { projectId: projects[4].id, tagId: tags[11].id },
            { projectId: projects[4].id, tagId: tags[12].id },
            { projectId: projects[4].id, tagId: tags[17].id },
            { projectId: projects[4].id, tagId: tags[20].id },

            { projectId: projects[5].id, tagId: tags[1].id },
            { projectId: projects[5].id, tagId: tags[10].id },
            { projectId: projects[5].id, tagId: tags[15].id },
            { projectId: projects[5].id, tagId: tags[20].id },

            { projectId: projects[6].id, tagId: tags[0].id },
            { projectId: projects[6].id, tagId: tags[9].id },
            { projectId: projects[6].id, tagId: tags[10].id },
            { projectId: projects[6].id, tagId: tags[11].id },
            { projectId: projects[6].id, tagId: tags[14].id },
            { projectId: projects[6].id, tagId: tags[16].id },
            { projectId: projects[6].id, tagId: tags[20].id },

            { projectId: projects[7].id, tagId: tags[1].id },
            { projectId: projects[7].id, tagId: tags[10].id },
            { projectId: projects[7].id, tagId: tags[20].id },

            { projectId: projects[8].id, tagId: tags[0].id },
            { projectId: projects[8].id, tagId: tags[6].id },
            { projectId: projects[8].id, tagId: tags[10].id },
            { projectId: projects[8].id, tagId: tags[17].id },
            { projectId: projects[8].id, tagId: tags[20].id },

            { projectId: projects[9].id, tagId: tags[1].id },
            { projectId: projects[9].id, tagId: tags[3].id },
            { projectId: projects[9].id, tagId: tags[6].id },
            { projectId: projects[9].id, tagId: tags[10].id },
            { projectId: projects[9].id, tagId: tags[19].id },
            { projectId: projects[9].id, tagId: tags[20].id },
            { projectId: projects[9].id, tagId: tags[21].id },
            
            { projectId: projects[10].id, tagId: tags[0].id },
            { projectId: projects[10].id, tagId: tags[10].id },
            { projectId: projects[10].id, tagId: tags[19].id },
            { projectId: projects[10].id, tagId: tags[20].id },
            { projectId: projects[10].id, tagId: tags[23].id },
            { projectId: projects[10].id, tagId: tags[24].id },
        ].map(v => ProjectTag.create(v));
    });
}
