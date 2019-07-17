/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { MetadataKeys, IRouteMetadata, getMetadataList, AllowedMethods } from "../metadata";

export function Route(method: AllowedMethods, path: string): MethodDecorator {

    return<T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void => {

        getMetadataList<IRouteMetadata>(MetadataKeys.HANDLER_ROUTES, target, propertyKey).push({ method, path });

        return target;

    };

}

export function Get(path: string) {
    return Route('get', path);
}

export function Post(path: string) {
    return Route('post', path);
}

export function Put(path: string) {
    return Route('put', path);
}

export function Patch(path: string) {
    return Route('patch', path);
}

export function Delete(path: string) {
    return Route('delete', path);
}

export function Options(path: string) {
    return Route('options', path);
}
