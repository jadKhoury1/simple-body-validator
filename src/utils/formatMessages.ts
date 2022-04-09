'use strict';

import { CustomMesages } from "../types";
import { isSizeRule } from "./general";
import validationMessages from '../locales/en';
import replaceAttributes from '../validators/replaceAttributes';
import { builValidationdMethodName } from "./build";



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
export function getMessage(attribute: string, rule: string, value: any, customMessages: CustomMesages, hasNumericRule: boolean): string {

    // check if error exists inside the custom message object provided by the user
    const inlineMessage: string|null = getFromLocalObject(attribute, rule, customMessages);

    if (inlineMessage) {
        return inlineMessage;
    }

    // check if rule has sizes such as min, max, between ... 
    // and get message from local object
    if (isSizeRule(rule) === true) {
        return validationMessages[rule][getMesageType(value, hasNumericRule)];
    }

    // get message from local object
    return validationMessages[rule];
    
};

/**
 * Replace all error message place-holders with actual values.
 */
export function makeReplacements(message: string, attribute: string, rule: string, parameters: string[], data: object, hasNumericRule: boolean): string {

    message = message.replace(':attribute', attribute.replace('_', ' '));

    const methodName = `replace${builValidationdMethodName(rule)}`;

    if (typeof replaceAttributes[methodName] === 'function') {
        message = replaceAttributes[methodName](message, parameters, data, hasNumericRule);
    }

    return message;

}
