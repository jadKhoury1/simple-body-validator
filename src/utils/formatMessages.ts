'use strict';

import { CustomMesages } from '../types';
import { isSizeRule } from './general';
import Lang from '../lang';
import { deepFind, dotify } from './object';



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
 * Get the custom message for a rule if exists
 */
function getCustomMessage(attributes: string[], rule: string, customMessages: CustomMesages, messageType: string, lang: string): string|null {

    // The primary attribute is only used for wildcard rules, for example if the attribute is 'user.1.email'
    // the primary attribute value will be 'user.*.email'
    let [attribute, primaryAttribute] = attributes;

    // get the translated messages form the custom attribute in the language file
    const translatedMessages = dotify(Lang.get(lang)['custom'] || {});

    // The key combination will look something like this [user.*.email.required, *.email.required, email.required, required]
    // This way we will be able to search all the possible combinations
    const keys: string[] = getKeyCombinations(`${attribute}.${rule}`);
    let allKeys: string[] = keys;

    // If the primary attribute exists we should merge all the combinations together
    if (primaryAttribute) {
        allKeys = [];
        const primaryAttributeKeys = getKeyCombinations(`${primaryAttribute}.${rule}`);
        for(let i = 0; i < keys.length; i++) { 
            allKeys.push(keys[i]);
            if (keys[i] !== primaryAttributeKeys[i]) {
                allKeys.push(primaryAttributeKeys[i]);
            }
        }
    }

    if (isSizeRule(rule)) {
        allKeys.pop();
        allKeys.push(`${rule}.${messageType}`);
        allKeys.push(rule);
    }

    let key: string = '';
    let message: string|undefined = '';
    for (let i = 0; i < allKeys.length; i++) {
        key = allKeys[i];
        // The developer may dynamically specify the object of custom messages on the validator instance
        // If the key exists in the object it is used over the other ways of pulling the 
        // message for this given key
        if (customMessages.hasOwnProperty(key)) {
            return customMessages[key];
        }
        
        // try to get the custom error message from the translation file
        message = translatedMessages[key];

        if (typeof message === 'string') {
            return message;
        }
    }

    return null;
};

/**
 * Get the validation message for an attribute and rule.
 */
export function getMessage(attributes: string[], rule: string, value: any, customMessages: CustomMesages, hasNumericRule: boolean, lang: string): string {

    // check if error exists inside the custom message object provided by the user
    const inlineMessage: string|null = getCustomMessage(attributes, rule, customMessages, getMesageType(value, hasNumericRule), lang);

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


