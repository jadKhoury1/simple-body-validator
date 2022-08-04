'use strict';

import { CustomMesages } from '../types';
import { isSizeRule } from './general';
import Lang from '../lang';
import { deepFind } from './object';



/**
 * Get the message type based on the value. The message type is used essentially for size rules
 */
function getMesageType(value: any, hasNumericRule: boolean = false): string {

    if (typeof value === 'number' || typeof value === 'undefined' || (isNaN(value) === false && hasNumericRule === true)) {
        return 'number';
    }

    if (Array.isArray(value)) {
        return 'array';
    }

    return typeof value;
};

/**
 * Get the inline message for a rule if exists
 */
function getFromLocalObject(attribute: string, rule: string, customMessages: CustomMesages): string|null {
    const key: string = `${attribute}.${rule}`;

    if (typeof customMessages[key] !== 'undefined') {
        return customMessages[key];
    } else if (typeof customMessages[rule] !== 'undefined') {
        return customMessages[rule];
    }

    for (let messageKey in customMessages) {
        if (messageKey.indexOf('*') !== -1 ) {
            let pattern: RegExp  = new RegExp('^' + messageKey.replace(/\*/g, '[^\.]*'));
            if (key.match(pattern)) {
                return customMessages[messageKey];
            }
        }
    };

    return null;
};

/**
 * Get the validation message for an attribute and rule.
 */
export function getMessage(attribute: string, rule: string, value: any, customMessages: CustomMesages, hasNumericRule: boolean, lang: string): string {

    // check if error exists inside the custom message object provided by the user
    const inlineMessage: string|null = getFromLocalObject(attribute, rule, customMessages);

    if (inlineMessage) {
        return inlineMessage;
    }

    const validationMessages: object = Lang.get(lang);

    // check if rule has sizes such as min, max, between ...
    // and get message from local object
    if (isSizeRule(rule) === true) {
        return validationMessages[rule][getMesageType(value, hasNumericRule)];
    }

    // get message from local object
    return validationMessages[rule] || '';

};

/**
 * Convert a string to snake case.
 */
export function toSnakeCase(string: string): string {
    return string
            .split(/ |\B(?=[A-Z])/)
            .map(word => word.toLowerCase())
            .join('_');
};

/**
 * Get the formatted name of the attribute
 */
export function getFormattedAttribute(attribute: string): string {
    return toSnakeCase(getPrimaryKeyFromPath(attribute)).replace(/_/g, ' ').trim();
};

/**
 * Get the given attribute from the attribute translations.
 */
export function getAttributeFromTranslations(key: string, lang: string): string|undefined {
    return deepFind(Lang.get(lang), `attributes.${key}`);
};

/**
 * Get the combinations of keys from a main key. For example if the main key is 'user.info.name',
 * the combination will be [user.info.name, info.name, name]
 */
export function getKeyCombinations(key: string): string[] {

    const combinations: string[] = [key];
    const splittedKey: string[] = key.split('.');

    while (splittedKey.length > 1) {
        splittedKey.shift();
        combinations.push(splittedKey.join('.'));
    }

    return combinations;
}

/**
 * The purpose of this method if to get the primary key associated with a path
 * For example the primary key for path 'user.info.email' will be 'email'
 */
function getPrimaryKeyFromPath(path: string): string {
    const splittedPath = path.split('.');

    // if the '.' does not exist in the path, then return the path itself
    if (splittedPath.length <= 1) {
        return path;
    }

    let key = splittedPath.pop();
    // if the new key is a number, check the next attribute
    if (isNaN(parseInt(key)) === false) {
        return getPrimaryKeyFromPath(splittedPath.join('.'));
    }

    return key;
};


