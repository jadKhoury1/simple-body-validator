'use strict';

/**
 * Get value at path of object. If the resolved value is undifined, the returned result will be undefined
 */
 export function deepFind(obj: object, path: string): undefined|object {

    const paths: string[] = path.split('.');

    for (let i = 0; i < paths.length; i++) {
        if (typeof obj[paths[i]] === 'undefined') {
            return undefined;
        }
        obj = obj[paths[i]];
    }

    return obj;

}

/**
 * Set value at path of object. 
 */
export function deepSet(obj: any[]|object, path: string|string[], value: any): void {
    const paths: string[] = typeof path === 'string' ? path.split('.') : path;
    const segment = paths.shift();

    if (segment === '*') {
        obj = Array.isArray(obj) ? obj : [];
        
        if (paths.length > 0) {
            // @ts-ignore
            obj.forEach(inner => deepSet(inner, [...paths], value));
        } else {
            // @ts-ignore
            for (let i = 0; i < obj.length; i++) {
                obj[i] = value;
            }
        }
    } else if (paths.length > 0) {
        if (typeof obj[segment] !== 'object') {
            obj[segment] = {};
        }
        deepSet(obj[segment], paths, value);
    } else {
        obj[segment] = value;
    }
}

/**
 * Flatten a multi-dimensional associative array with dots.
 */
export function dotify(obj: object) {
    let res: object = {};

    (function recurse(obj: object|any[], current: string = '') {
        for (let key in obj) {
            let value: any = obj[key];
            let newKey: string = (current ? `${current}.${key}` : key);

            if (value && typeof value === 'object' && !(value instanceof Date)) {
                recurse(value, newKey);
            } else {
                res[newKey] = obj[key];
            }
        }
    })(obj);

    return res;
}