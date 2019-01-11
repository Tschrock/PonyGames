/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Authenticator } from "passport";
import { Sequelize } from "sequelize-typescript";

import { serializeUser, deserializeUser, buildVerifyFunction, VerifyFunction } from "../lib/Auth/PassportUtil";
import { StrategyProvider, IStrategyOptions } from "../lib/Auth/StrategyProvider";

export interface IStrategyProviderOptions {
    id: string;
    name: string;
    package: string;
    options: IStrategyOptions;
}

export interface IAuthOptions {
    providers: IStrategyProviderOptions[];
}

export class AuthService {

    public readonly authenticator: Authenticator;
    private providers: Map<string, StrategyProvider> = new Map();
    private verifyFunction: VerifyFunction;

    constructor(options: IAuthOptions, database: Sequelize) {

        // Build the verify function
        this.verifyFunction = buildVerifyFunction(database);
        
        // Create a new Authenticator
        this.authenticator = new Authenticator() as object as Authenticator;
        
        // Register the user serializers
        this.authenticator.serializeUser(serializeUser);
        this.authenticator.deserializeUser(deserializeUser);

        // Load all strategy providers from the options
        options.providers.forEach(p => this.registerStrategyProvider(p));

    }

    private registerStrategyProvider(options: IStrategyProviderOptions) {

        // Make sure it's not already registered
        if(this.providers.has(options.id)) throw new Error(`Error registering auth strategy provider: A provider with id '${options.id}' has already been registered.`);
        
        // Try and load the package
        const strategyModule = require(options.package);

        // Make sure it exported a Strategy
        if(!('Strategy' in strategyModule)) throw new Error(`Error registering auth strategy provider: Package '${options.package}' has no 'Strategy'`);

        // Create a new provider and register it
        const provider = new StrategyProvider(options.id, options.name, strategyModule.Strategy, options.options);
        this.providers.set(options.id, provider);
        
        // Create a new strategy and register it
        const strategy = provider.buildStrategy("", this.verifyFunction);
        this.authenticator.use(strategy);
        
        return provider;

    }

    public hasProvider(id: string) {
        return this.providers.has(id);
    }

    public getProvider(id: string) {
        return this.providers.get(id);
    }

    public getProviders() {
        return [...this.providers.values()];
    }

}
