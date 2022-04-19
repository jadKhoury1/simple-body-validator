'use strict';

import { 
    Rules, CustomMesages, ErrorMessage, 
    ImplicitAttributes, Rule, InitialRules 
} from './types';
import { builValidationdMethodName } from './utils/build';
import { getMessage, makeReplacements } from './utils/formatMessages';
import validateAttributes from './validators/validateAttributes';
import validationRuleParser from './validators/validationRuleParser';
import { getNumericRules, isImplicitRule, isRule } from './utils/general';
import { deepFind, dotify, isObject } from './utils/object';
import ErrorBag from './validators/errorBag';
import RuleContract  from './rules/ruleContract';
import Lang from './lang';
import Password from './rules/password';

class Validator {

    /**
     * The lang used to return error messages
     */
    private lang: string;

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
    private initalRules: InitialRules;

    /**
     * The array of wildcard attributes with their asterisks expanded.
     */
    private implicitAttributes: ImplicitAttributes;

    /**
     * Hold the error messages
     */
    private messages: ErrorBag;


    /**
     * Stores an instance of the validateAtteibutes class
     */
    private validateAttributes: validateAttributes;

    /**
     * Custom mesages returrned based on the error 
     */
    customMessages: CustomMesages;


    constructor(data: object, rules: InitialRules, customMessages: CustomMesages = {}) {
        this.data = data;
        this.customMessages = customMessages;
        this.initalRules = rules;
        this.lang = Lang.getDefaultLang();
        this.addRules(rules);
    };

    setData(data: object): Validator {
        this.data = data;
        this.addRules(this.initalRules);
        return this;
    };

    setRules(rules: InitialRules): Validator {
        this.addRules(rules);
        this.initalRules = rules;
        return this;
    };

    setLang(lang: string): Validator {
        this.lang = lang;
        return this;
    };

    setCustomMessages(customMessages: CustomMesages = {}) {
        this.customMessages = customMessages;
        return this;
    };



    errors(): ErrorBag {
        return this.messages;
    }


    validate(): boolean {
        if (!isObject(this.data)) {
            throw 'The data attribute must be an object';
        }

        this.messages = new ErrorBag();
        this.validateAttributes = new validateAttributes(this.data, this.rules);

        for(const property in this.rules) {
            if (this.rules.hasOwnProperty(property) && Array.isArray(this.rules[property])) {
                for (let i = 0; i < this.rules[property].length; i++) {
                    this.validateAttribute(property, this.rules[property][i]);
                }
            }
        }

        return this.messages.keys().length === 0;
    };

    /**
     * Parse the given rules add assign them to the current rules 
     */
    private addRules(rules: InitialRules): void {

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
    private validateAttribute(attribute: string, rule: Rule): void {
         
        let parameters: string[] = [];

        [rule ,parameters] = validationRuleParser.parse(rule);

        const keys: string[] = this.getExplicitKeys(attribute);

        if (keys.length > 0 && parameters.length > 0) {
            parameters = this.replaceAsterisksInParameters(parameters, keys);
        }

        const value = deepFind(this.data, attribute);
        const validatable: boolean = this.isValidatable(rule, value);

        if (rule instanceof RuleContract) {
            return validatable ? this.validateUsingCustomRule(attribute, value, rule) : null;
        }

        const method = `validate${builValidationdMethodName(rule)}`;

        if (typeof this.validateAttributes[method] === 'undefined') {
            throw `Rule ${rule} is not valid`;
        }

        if (validatable && 
                !this.validateAttributes[method](value, parameters, attribute)
        ) {
            this.addFailure(attribute, rule, value, parameters);
        }

    };

    private validateUsingCustomRule(attribute: string, value: any, rule: RuleContract): void {

        rule.setData(this.data).setLang(this.lang);

        if (rule instanceof Password) {
            rule.setValidator(this);
        }

        if (rule.passes(value, attribute)) {
            return;
        }

        let result: object|string = rule.getMessage();
        let messages: object = typeof result === 'string' ? [ result ] : result;


        for(let key in messages) {
            this.messages.add(attribute, {
                error_type: rule.constructor.name, message: makeReplacements(
                    messages[key], attribute, rule.constructor.name, []
                )
            });
        }

    };

    /**
     * Add a new error message to the messages object
     */
    private addFailure(attribute: string, rule: string, value: any, parameters: string[]): void {

        const hasNumericRule = validationRuleParser.hasRule(attribute, getNumericRules(), this.rules);

        const message: string = makeReplacements(
            getMessage(attribute, rule, value, this.customMessages, hasNumericRule, this.lang),
            attribute, rule, parameters, this.data, hasNumericRule
        );

        const error: ErrorMessage = {
            error_type: rule,
            message
        };

        this.messages.add(attribute, error);
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
    private isValidatable(rule: Rule, value: any) {
        return value !== null && typeof value !== 'undefined' ||  isImplicitRule(rule);
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