/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getMetadata, IHasMetadata } from "../metadata/RouterMetadata";
import { ICanBeMiddleware } from "../IMiddleware";

/**
 * Adds a middleware to use before a route.
 * @param middleware The middleware function to use.
 */
export function UseBefore(middleware: ICanBeMiddleware): MethodDecorator & ClassDecorator {
    return (target: Object | Function, propertyKey?: string | symbol, descriptor?: PropertyDescriptor) => {
        if(typeof propertyKey === 'symbol') throw new Error();

        if(propertyKey) {
            const metadata = getMetadata(target as IHasMetadata);
            const handler = metadata.getHandler(propertyKey);
            handler.beforeMiddlewares.unshift(middleware); // Unshift because decorators are applied bottom-up.
            return descriptor as void; // Used to shut up typescript
        }
        else {
            const metadata = getMetadata((target as Function).prototype as IHasMetadata);
            metadata.beforeMiddlewares.unshift(middleware); // Unshift because decorators are applied bottom-up.
            return void 0;
        }

    };
}
