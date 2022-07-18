'use strict';

import { CustomMesages } from "../types";
import { isSizeRule } from './general';
import replaceAttributes from '../validators/replaceAttributes';
import { builValidationdMethodName } from './build';
import Lang from '../lang';



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
 * Replace all error message place-holders with actual values.
 */
export function makeReplacements(message: string, attribute: string, rule: string, parameters: string[], data: object = {}, hasNumericRule: boolean = false): string {

    message = message.replace(':attribute', getDisplayableAttribute(attribute));
    const methodName = `replace${builValidationdMethodName(rule)}`;

    if (typeof replaceAttributes[methodName] === 'function') {
        message = replaceAttributes[methodName](message, parameters, data, hasNumericRule);
    }

    return message;

}

/**
 * Convert a string to snake case.
 */
export function toSnakeCase(string: string): string {
    return string
            .split(/ |\B(?=[A-Z])/)
            .map(word => word.toLowerCase())
            .join('_');
}

/**
 * Get the displayable name of the attribute.
 */
export function getDisplayableAttribute(attribute: string): string {
    return toSnakeCase(splitMessage(attribute)).replace(/_/g, ' ').trim();
} 

function splitMessage(attribute: string): string {
    const splittedAttribute = attribute.split('.');

    // if the '.' does not exist in the attribute, then return the attribute itself
    if (splittedAttribute.length <= 1) {
        return attribute;
    }

    let newAttribute = splittedAttribute.pop();
    // if the new attribute is a number, check the next attribute
    if (isNaN(parseInt(newAttribute)) === false) {
        return splitMessage(splittedAttribute.join('.'));
    }

    return newAttribute;
}


