'use strict';

import { Rules, Messages } from './types';
import { builValidationdMethodName } from './utils/build';
import { getMessage, makeReplacements } from './utils/formatMessages';
import validateAttributes from './validators/validateAttributes';
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
    customMessages: Messages;

    /**
     * Hold the error messages
     */
    messages: Messages;


    constructor(data: object, rules: Rules, customMessages: Messages = {}) {
        this.data = data;
        this.customMessages = customMessages;
        this.rules = validationRuleParser.explodeRules(rules);
        this.messages = {};
    };


    validate() {
        for(const property in this.rules) {
            if (this.rules.hasOwnProperty(property) && Array.isArray(this.rules[property])) {
                for (let i = 0; i < this.rules[property].length; i++) {
                    this.validateAttribute(property, this.rules[property][i]);
                }
            }
        }
    };

    validateAttribute(attribute: string, rule: string) {
         
        let parameters: string[] = [];

        [rule ,parameters] = validationRuleParser.parseStringRule(rule);

        const value = this.data[attribute];
        const method = `validate${builValidationdMethodName(rule)}`;

        if (validateAttributes[method](value, parameters, this.data) === false) {
            this.addFailure(attribute, rule, value, parameters);
        }

    };

    addFailure(attribute: string, rule: string, value: any, parameters: string[]) {
        this.messages[attribute] = makeReplacements(
            getMessage(attribute, rule, value, this.customMessages),
            attribute, rule, parameters, this.data
        );
    };
}

export default Validator;