'use strict';

import { Messages } from "../types";
import { isSizeRule } from "./general";
import validationMessages from '../locales/en';
import replaceAttributes from '../validators/replaceAttributes';
import { builValidationdMethodName } from "./build";



function getMesageType(value: any) {
    
    if (Array.isArray(value)) {
        return 'array';
    }

    return typeof value;
};

export function getMessage(attribute: string, rule: string, value: any, customMessages: Messages) {

    // check if error exists inside the custom message object provided by the user
    const inlineMessage: string = customMessages[`${attribute}.${rule}`];

    if (inlineMessage) {
        return inlineMessage;
    }

    // check if rule has sizes such as min, max, between ... 
    // and get message from local object
    if (isSizeRule(rule) === true) {
        return validationMessages[rule][getMesageType(value)];
    }

    // get message from local object
    return validationMessages[rule];
    
};


export function makeReplacements(message: string, attribute: string, rule: string, parameters: string[], data: object) {

    message = message.replace(':attribute', attribute.replace('_', ' '));

    const methodName = `replace${builValidationdMethodName(rule)}`;

    if (typeof replaceAttributes[methodName] === 'function') {
        message = replaceAttributes[methodName](message, parameters, data);
    }

    return message;

}
