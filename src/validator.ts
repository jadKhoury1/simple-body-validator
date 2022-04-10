'use strict';

import { Rules, Messages, CustomMesages, ErrorMessage, ErrorConfig, ImplicitAttributes } from './types';
import { builValidationdMethodName } from './utils/build';
import { getMessage, makeReplacements } from './utils/formatMessages';
import validateAttributes from './validators/validateAttributes';
import validationRuleParser from './validators/validationRuleParser';
import { getNumericRules, isImplicitRule } from './utils/general';
import { deepFind, dotify } from './utils/object';

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
     * This is an unchanged version of the inital rules before being changed for wildcard validations
     */
    private initalRules: Rules

    /**
     * The array of wildcard attributes with their asterisks expanded.
     */
    private implicitAttributes: ImplicitAttributes;

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
    private validateAttributes: validateAttributes;


    constructor(data: object, rules: Rules, customMessages: CustomMesages = {}) {
        this.data = data;
        this.customMessages = customMessages;
        this.initalRules = rules;
        this.addRules(rules);
    };

    setData(data: object): Validator {
        this.data = data;
        this.addRules(this.initalRules);
        return this;
    };

    setRules(rules: Rules): Validator {
        this.addRules(rules);
        this.initalRules = rules;
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

    /**
     * Get all the error messages
     */
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

    /**
     * Get only the first error message from the messages object
     */
    firstError(): string {
        return this.firstMessage;
    };

    /**
     * Parse the given rules add assign them to the current rules 
     */
    private addRules(rules: Rules) {

        // The primary purpose of this parser is to expand any "*" rules to the all
        // of the explicit rules needed for the given data. For example the rule
        // names.* would get expanded to names.0, names.1, etc. for this data.
        const response: {rules: Rules, implicitAttributes: ImplicitAttributes} = 
            validationRuleParser.explodeRules(dotify(rules, true), this.data);

        this.rules = response.rules;
        this.implicitAttributes = response.implicitAttributes;
    }

    /**
     * validate a given attribute against a rule.
     */
    private validateAttribute(attribute: string, rule: string): void {
         
        let parameters: string[] = [];

        [rule ,parameters] = validationRuleParser.parseStringRule(rule);

        const keys: string[] = this.getExplicitKeys(attribute);

        if (keys.length > 0 && parameters.length > 0) {
            parameters = this.replaceAsterisksInParameters(parameters, keys);
        }

        const value = deepFind(this.data, attribute);
        const method = `validate${builValidationdMethodName(rule)}`;

        if (this.isValidatable(rule, value) && 
                this.validateAttributes[method](value, parameters, attribute) === false
        ) {
            this.addFailure(attribute, rule, value, parameters);
        }

    };

    /**
     * Add a new error message to the messages object
     */
    private addFailure(attribute: string, rule: string, value: any, parameters: string[]): void {

        const hasNumericRule = validationRuleParser.hasRule(attribute, getNumericRules(), this.rules);

        let message: string = makeReplacements(
            getMessage(attribute, rule, value, this.customMessages, hasNumericRule),
            attribute, rule, parameters, this.data, hasNumericRule
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

    /**
     * Replace each field parameter which has asterisks with the given keys.
     * 
     * Example: parameters = [name.*.first] and keys = [1], then the result will be name.1.first
     */
    private replaceAsterisksInParameters(parameters: string[], keys: string[]): string[] {
        return parameters.map(parameter => {
            let result: string = '';
            if (parameter.indexOf('*') !== -1) {
                let parameterArray: string[] = parameter.split('*');
                result = parameterArray[0];
                for (let i = 1; i < parameterArray.length; i++) {
                    result = result.concat((keys[i-1] || '*') + parameterArray[i])
                }
            }
            return result || parameter;
        });
    }

    /**
     * Determine if the attribute is validatable.
     */
    private isValidatable(rule: string, value: any) {
        return typeof value !== 'undefined' || isImplicitRule(rule);
    }


    /**
     * Get the primary attribute name
     * 
     * Example:  if "name.0" is given, "name.*" will be returned
     */
    private getPrimaryAttribute(attribute: string): string {
        for (let unparsed in this.implicitAttributes) {
            if (this.implicitAttributes[unparsed].indexOf(attribute) !== -1) {
                return unparsed;
            }
        }

        return attribute;
    }

    /**
     * Get the explicit keys from an attribute flattened with dot notation.
     * 
     * Example: 'foo.1.bar.spark.baz' -> [1, 'spark'] for 'foo.*.bar.*.baz'
     */
    private getExplicitKeys(attribute: string): string[] {

       const pattern: RegExp = new RegExp('^' + this.getPrimaryAttribute(attribute).replace(/\*/g, '([^\.]*)'));
       let keys = attribute.match(pattern);
       
       if (keys) {
           keys.shift();
           return keys;
       }

       return [];

    };

}

export default Validator;