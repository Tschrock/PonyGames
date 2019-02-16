/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { getMetadata } from "../metadata/RouterMetadata";
import { RouteMetadata, RouteMethod } from "../metadata/RouteMetadata";

/** Builds a route decorator */
function buildDecorator(method: RouteMethod, route: string): MethodDecorator & PropertyDecorator {
    return (target: Object, key: string | symbol, descriptor?: PropertyDescriptor) => {
        if(typeof key === 'symbol') throw new Error();
        const metadata = getMetadata(target);
        metadata.addRoute(key, new RouteMetadata(method, route));
        return descriptor;
    };
}

/** A generic route. */
export function Route(method: RouteMethod, route: string) {
    return buildDecorator(method, route);
}

/** All methods of a route. */
export function All(route: string) {
    return buildDecorator("all", route);
}

/** The Get method of a route. */
export function Get(route: string) {
    return buildDecorator("get", route);
}

/** The Post method of a route. */
export function Post(route: string) {
    return buildDecorator("post", route);
}

/** The Put method of a route. */
export function Put(route: string) {
    return buildDecorator("put", route);
}

/** The Delete method of a route. */
export function Delete(route: string) {
    return buildDecorator("delete", route);
}

/** The Patch method of a route. */
export function Patch(route: string) {
    return buildDecorator("patch", route);
}

/** The Options method of a route. */
export function Options(route: string) {
    return buildDecorator("options", route);
}

/** The Head method of a route. */
export function Head(route: string) {
    return buildDecorator("head", route);
}

/** The use method of a route. */
export function Use(route: string) {
    return buildDecorator("use", route);
}
