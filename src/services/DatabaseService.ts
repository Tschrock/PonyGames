/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import debugBuilder from 'debug';
import { Sequelize } from "sequelize-typescript";

import { modelsRoot } from '../paths';
import { Team } from '../models/Team';
import { Project } from '../models/Project';
import { Tag } from '../models/Tag';

const debug = debugBuilder('db');

export interface IDatabaseOptions {
    database: string;
    dialect: 'mysql' | 'sqlite' | 'postgres' | 'mssql';
    username: string;
    password: string;
    storage?: string;
}

export class DatabaseService {

    public readonly database: Sequelize;

    constructor(options: IDatabaseOptions) {

        console.debug(`Starting db service using '${modelsRoot}'`);

        // Create a new Database connection
        this.database = new Sequelize({
            logging: debug,
            modelPaths: [modelsRoot],
            operatorsAliases: false,
            ...options
        });

        // Start a database sync
        this.database.sync({ force: true }).then(() => this.loadTestData()).then(() => {
            console.debug("Connected to database");
        })

    }

    private async loadTestData() {
        const team = await Team.create({
            name: "Fawn Dawn Studios",
            summary: "Creating a unique 2D Metroidvania Platformer called Stonicorn."
        });
        const tagNames = ["2D", "Adventure", "Platformer", "Windows", "Mac", "Linux", "In Active Development", "Demo Available"];
        const tags = await Promise.all(tagNames.map(key => Tag.create({ key })));
        const project = await Project.create({
            name: "Stonicorn",
            summary: "Stonicorn is a 2D adventure platforming game about a unicorn who has been turned to stone. Teleport your way through unique crazy worlds with surprises around every corner!"
        });
        await project.$set("team", team);
        await project.$set("tags", tags);


        const team2 = await Team.create({
            name: "A Little Bit Different",
            summary: "Developing Ambient.White."
        });
        const project2 = await Project.create({
            name: "Ambient.White",
            summary: "A game thing"
        });
        await project2.$set("team", team2);
        await project2.$set("tags", tags);


        const team3 = await Team.create({
            name: "Test Team 3",
            summary: "Developing a game."
        });
        const project3 = await Project.create({
            name: "Test Game 3",
            summary: "A game thing"
        });
        await project3.$set("team", team3);
        await project3.$set("tags", tags);


        const team4 = await Team.create({
            name: "Test Team 4",
            summary: "Developing a game."
        });
        const project4 = await Project.create({
            name: "Test Game 4",
            summary: "A game thing"
        });
        await project4.$set("team", team4);
        await project4.$set("tags", tags);


        const team5 = await Team.create({
            name: "Test Team 5",
            summary: "Developing a game."
        });
        const project5 = await Project.create({
            name: "Test Game 5",
            summary: "A game thing"
        });
        await project5.$set("team", team5);
        await project5.$set("tags", tags);


        const team6 = await Team.create({
            name: "Test Team 6",
            summary: "Developing a game."
        });
        const project6 = await Project.create({
            name: "Test Game 6",
            summary: "A game thing"
        });
        await project6.$set("team", team6);
        await project6.$set("tags", tags);


        const team7 = await Team.create({
            name: "Test Team 7",
            summary: "Developing a game."
        });
        const project7 = await Project.create({
            name: "Test Game 7",
            summary: "A game thing"
        });
        await project7.$set("team", team7);
        await project7.$set("tags", tags);
    }

}
