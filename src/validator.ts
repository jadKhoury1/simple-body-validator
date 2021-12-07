'use strict';

import { Rules, Messages, CustomMesages, ErrorMessage, ErrorConfig } from './types';
import { builValidationdMethodName } from './utils/build';
import { getMessage, makeReplacements } from './utils/formatMessages';
import validateAttributes from './validators/validateAttributes';
import validationRuleParser from './validators/validationRuleParser';

class Validator {

    /**
     * The data object that will be validated
     */
    private data: object;

    /**
     * The rules that will be used to check the validity of the data    
     */
    private rules: Rules;

    /**
     * Custom mesages returrned based on the error 
     */
    private customMessages: CustomMesages;

    /**
     * Hold the error messages
     */
    private messages: Messages[];

    /**
     * Stores the first error message
     */
    private firstMessage: string;

    /**
     * Stores an instance of the validateAtteibutes class
     */
    validateAttributes: validateAttributes;


    constructor(data: object, rules: Rules, customMessages: CustomMesages = {}) {
        this.data = data;
        this.customMessages = customMessages;
        this.rules = validationRuleParser.explodeRules(rules);
    };

    setData(data: object): Validator {
        this.data = data;
        return this;
    };

    setRules(rules: Rules): Validator {
        this.rules = validationRuleParser.explodeRules(rules);
        return this;
    };

    setCustomMessages(customMessages: CustomMesages = {}) {
        this.customMessages = customMessages;
        return this;
    };

    validate(): boolean {
        this.firstMessage = '';
        this.messages = [];
        this.validateAttributes = new validateAttributes(this.data, this.rules);

        for(const property in this.rules) {
            if (this.rules.hasOwnProperty(property) && Array.isArray(this.rules[property])) {
                for (let i = 0; i < this.rules[property].length; i++) {
                    this.validateAttribute(property, this.rules[property][i]);
                }
            }
        }

        return Object.keys(this.messages).length === 0;
    };

    errors(errorConfig: Partial<ErrorConfig> = {}): object {

        const messages = { ... this.messages };

        if (!errorConfig.withErrorTypes) {
            Object.keys(messages).map(attribute => messages[attribute] = messages[attribute].map(data => data.message));
        }

        if (!errorConfig.allMessages) {
            Object.keys(messages).map(attribute => messages[attribute] = messages[attribute][0]);
        }

        return messages;

    };

    firstError(): string {
        return this.firstMessage;
    };

    private validateAttribute(attribute: string, rule: string): void {
         
        let parameters: string[] = [];

        [rule ,parameters] = validationRuleParser.parseStringRule(rule);

        const value = this.data[attribute];
        const method = `validate${builValidationdMethodName(rule)}`;

        if (this.validateAttributes[method](value, parameters, this.data) === false) {
            this.addFailure(attribute, rule, value, parameters);
        }

    };

    private addFailure(attribute: string, rule: string, value: any, parameters: string[]): void {

        let message: string = makeReplacements(
            getMessage(attribute, rule, value, this.customMessages),
            attribute, rule, parameters, this.data
        );

        this.firstMessage = this.firstMessage || message;

        let error: ErrorMessage = {
            error_type: rule,
            message
        };

        if (Array.isArray(this.messages[attribute])) {
            this.messages[attribute].push(error);
        } else {
            this.messages[attribute] = [error];
        }

    };
}

export default Validator;