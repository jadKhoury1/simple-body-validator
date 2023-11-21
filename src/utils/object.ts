'use strict';

import { GenericObject } from '../types';
import { isArrayOfRules, isRule } from './general';

/**
 * Get value at path of object. If the resolved value is undifined, the returned result will be undefined
 */
 export function deepFind(obj: object, path: string): any {

    const paths: string[] = path.split('.');

    for (let i = 0; i < paths.length; i++) {
        if (typeof obj[paths[i]] === 'undefined') {
            return undefined;
        }
        obj = obj[paths[i]];
    }

    return obj;

};

/**
 * Set value at path of object. 
 */
export function deepSet(target: any, path: string|string[], value: any): void {
    const paths: string[] = typeof path === 'string' ? path.split('.') : path;
    const segment = paths.shift();

    if (segment === '*') {
        target = Array.isArray(target) ? target : [];
        
        if (paths.length > 0) {
            target.forEach(inner => deepSet(inner, [...paths], value));
        } else {
            for (let i = 0; i < target.length; i++) {
                target[i] = value;
            }
        }
    } else if (paths.length > 0) {
        if (typeof target[segment] !== 'object') {
            target[segment] = {};
        }
        deepSet(target[segment], paths, value);
    } else {
        if (typeof target !== 'object' || target === null) {
            target = {};
        }
        target[segment] = value;
    }
};

/**
 * Flatten a multi-dimensional associative array with dots.
 */
export function dotify(obj: object, ignoreRulesArray: boolean = false, withBaseObjectType = false): GenericObject {
    let res: object = {};

    (function recurse(obj: object|any[], current: string = '') {
        for (let key in obj) {
            let value: any = obj[key];
            let newKey: string = (current ? `${current}.${key}` : key);

            if (value && typeof value === 'object' && !isRule(value) && !(value instanceof Date)) {
                // In the case we are dotifying the object of rules, we don't want the array of rules to be flattened
                if (ignoreRulesArray === true && Array.isArray(value) && isArrayOfRules(value)) {
                    res[newKey] = value;
                } else {
                    // Since the dotify is being used for both array and objects in some cases we would like to distinguish between both
                    if (withBaseObjectType) {
                        res[newKey] = Array.isArray(value) ? 'array' : 'object';
                    }
                    recurse(value, newKey);
                }
            } else {
                res[newKey] = value;
            }
        }
    })(obj);

    return res;
};

/**
 * Check if the value is an object
 */
export function isObject(value: any) {
    return value && typeof value === 'object' && !Array.isArray(value);
};

/**
 * Deeply merge nested objects
 */
export function mergeDeep(target, source) {
    let output = Object.assign({}, target);

    if (!isObject(target) || !isObject(source)) {
        return output;
    }

    for (const key in source) {
        if (isObject(source[key])) {
            if (!target[key]) {
                Object.assign(output, {[key]: source[key] });
            } else {
                output[key] = mergeDeep(target[key], source[key]);
            }

        } else {
            Object.assign(output, { [key]: source[key] });
        }
    }

    return output;
}

/**
 * Check if objects are deep equal
 */
export function deepEqual(firstParam: object, secondParam: object) {
    const first = dotify(firstParam, false, true);
    const second = dotify(secondParam, false, true);

    if (Object.keys(first).length !== Object.keys(second).length) {
        return false;
    }

    return Object.entries(first).every(([key, value]) => second[key] === value);
}