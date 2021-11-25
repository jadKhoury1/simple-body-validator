'use strict';

import { Rules, Messages } from './types';
import validateAttributes from './validateAttributes';
import validationRuleParser from './validationRuleParser';

class Validator {

    /**
     * The data object that will be validated
     */
    data: object;

    /**
     * The rules that will be used to check the validity of the data    
     */
    rules: Rules;

    /**
     * Custom mesages returrned based on the error 
     */
    messages: Messages;


    constructor(data: object, rules: Rules, messages: Messages = {}) {
        this.data = data;
        this.messages = messages;
        this.rules = validationRuleParser.explodeRules(rules);
    };


    validate(rules: Rules) {
        for(const property in rules) {
            if (rules.hasOwnProperty(property) && Array.isArray(rules[property])) {
                for (let i = 0; i < rules[property].length; i++) {
                    this.validateAttribute(property, rules[property][i]);
                }
            }
        }
    };

    validateAttribute(attribute: string, rule: string) {
         
        let parameters: string[] = [];

        [rule ,parameters] = validationRuleParser.parseStringRule(rule);

        const value = this.data[attribute];
        const method = `validate${rule}`;

        if (validateAttributes[method](value) === false) {
            this.addFailure(attribute, rule);
        }

    };

    addFailure(attribute: string, rule: string) {
        this.messages[attribute] = `${attribute} is ${rule}`;
    };
}

export default Validator;