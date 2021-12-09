'use strict';

import { CustomMesages, Rules } from "../types";
import { isSizeRule, getNumericRules } from "./general";
import validationMessages from '../locales/en';
import replaceAttributes from '../validators/replaceAttributes';
import { builValidationdMethodName } from "./build";
import validationRuleParser from "../validators/validationRuleParser";



function getMesageType(value: any, hasNumericRule: boolean = false): string {

    if (typeof value === 'number' || (isNaN(value) === false && hasNumericRule === true)) {
        return 'number';
    }

    if (Array.isArray(value)) {
        return 'array';
    }

    return typeof value;
};

export function getMessage(attribute: string, rule: string, value: any, customMessages: CustomMesages, rules: Rules): string {

    // check if error exists inside the custom message object provided by the user
    const inlineMessage: string = customMessages[`${attribute}.${rule}`];

    if (inlineMessage) {
        return inlineMessage;
    }

    // check if rule has sizes such as min, max, between ... 
    // and get message from local object
    if (isSizeRule(rule) === true) {
        return validationMessages[rule][getMesageType(value, validationRuleParser.hasRule(attribute, getNumericRules(), rules))];
    }

    // get message from local object
    return validationMessages[rule];
    
};


export function makeReplacements(message: string, attribute: string, rule: string, parameters: string[], data: object): string {

    message = message.replace(':attribute', attribute.replace('_', ' '));

    const methodName = `replace${builValidationdMethodName(rule)}`;

    if (typeof replaceAttributes[methodName] === 'function') {
        message = replaceAttributes[methodName](message, parameters, data);
    }

    return message;

}
