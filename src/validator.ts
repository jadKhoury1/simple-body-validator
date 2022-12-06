'use strict';

import {
    Rules, CustomMesages, ErrorMessage,
    ImplicitAttributes, Rule, InitialRules, CustomAttributes
} from './types';
import { builValidationdMethodName } from './utils/build';
import { getFormattedAttribute, getKeyCombinations, getMessage } from './utils/formatMessages';
import validateAttributes from './validators/validateAttributes';
import validationRuleParser from './validators/validationRuleParser';
import { getNumericRules, isImplicitRule } from './utils/general';
import { deepFind, deepSet, dotify, isObject } from './utils/object';
import ErrorBag from './validators/errorBag';
import RuleContract  from './rules/ruleContract';
import Lang from './lang';
import Password from './rules/password';
import validationData from './validators/validationData';
import replaceAttributes from './validators/replaceAttributes';
import replaceAttributePayload from './payloads/replaceAttributePayload';

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
     * Stores an instance of the validateAttributes class
     */
    private validateAttributes: validateAttributes;


    /**
     * Flag that defines wether or not validation should stop on first failure
     */
    private stopOnFirstFailureFlag: boolean;


    /**
     * Custom mesages returrned based on the error
     */
    customMessages: CustomMesages;

    /**
     * Object of custom attribute name;
     */
    customAttributes: CustomAttributes;


    constructor(data: object, rules: InitialRules, customMessages: CustomMesages = {}, customAttributes: CustomAttributes = {}) {
        this.data = data;
        this.customMessages = dotify(customMessages);
        this.customAttributes = dotify(customAttributes);
        this.initalRules = rules;
        this.lang = Lang.getDefaultLang();
        this.addRules(rules);
        this.messages = new ErrorBag();
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

    getLang(): string {
        return this.lang;
    }

    setCustomMessages(customMessages: CustomMesages = {}): Validator {
        this.customMessages = dotify(customMessages);
        return this;
    };

    setCustomAttributes(customAttributes: CustomAttributes = {}): Validator {
        this.customAttributes = dotify(customAttributes);
        return this;
    };

    stopOnFirstFailure(stopOnFirstFailure: boolean = true): Validator {
        this.stopOnFirstFailureFlag = stopOnFirstFailure;
        return this;
    };

    errors(): ErrorBag {
        return this.messages;
    };


    /**
     * Run the validator's rules against its data.
     */
    validate(key: string = '', value: any = undefined): boolean {
        if (!isObject(this.data)) {
            throw 'The data attribute must be an object';
        }
        this.validateAttributes = new validateAttributes(this.data, this.rules);

        if (!key) {
            this.runAllValidations();
            return this.messages.keys().length === 0;
        } else {
            this.runSingleValidation(key, value);
            return ! this.messages.has(key);
        } 
    };


    /**
     * Get the displayable name of the attribute.
     */
    getDisplayableAttribute(attribute: string): string {
        const primaryAttribute: string = this.getPrimaryAttribute(attribute);
        const attributeCombinations: string[] = getKeyCombinations(attribute);
        const translatedAttributes = dotify(Lang.get(this.lang)['attributes'] || {});
        let expectedAttributes: string[] = attributeCombinations;
        
        // Combine both attributes combinations in one array
        if (attribute !== primaryAttribute) {
            expectedAttributes = [];
            const primaryAttributeCombinations: string[] = getKeyCombinations(primaryAttribute);
            
            for (let i = 0; i < attributeCombinations.length; i++) {
                expectedAttributes.push(attributeCombinations[i]);
                if (attributeCombinations[i] !== primaryAttributeCombinations[i]) {
                    expectedAttributes.push(primaryAttributeCombinations[i]);
                }
            }
        }

        let name: string = '';
        let line: string|undefined = '';
        for (let i = 0; i < expectedAttributes.length; i++) {
            name = expectedAttributes[i];
            // The developer may dynamically specify the object of custom attributes on this 
            // validator instance. If the attribute exists in the object it is used over 
            // the other ways of pulling the attribute name for this given attribute.   
            if (this.customAttributes.hasOwnProperty(name)) {
                return this.customAttributes[name];
            }
            
            line = translatedAttributes[name];
            // We allow for a developer to specify language lines for any attribute
            if (typeof line === 'string') {
                return line;
            }
        }

        return getFormattedAttribute(attribute);
    }


    /**
     * Replace all error message place-holders with actual values.
     */
    private makeReplacements(
        message: string, attribute: string, rule: string, parameters: string[] = [], hasNumericRule: boolean = false,
    ): string {

        message = message.replace(':attribute', attribute);
        const methodName = `replace${builValidationdMethodName(rule)}`;

        if (typeof replaceAttributes[methodName] === 'function') {
            const payload = new replaceAttributePayload(
                this.data, message, parameters, hasNumericRule, (function(attribute) {
                    return this.getDisplayableAttribute(attribute)
                }).bind(this)
            )
            message = replaceAttributes[methodName](payload);
        }

        return message;

    };
    
    /**
     * Loop through all rules and run validation against each one of them
     */
    private runAllValidations(): void {
        this.messages = new ErrorBag();
        this.validateAttributes = new validateAttributes(this.data, this.rules);

        for(const property in this.rules) {
            this.runValidation(property);
        }
    }

    /**
     * Run validation for one specific attribute
     */
    private runSingleValidation(key: string, value: any = undefined) {
        this.messages = this.messages.clone();
        this.messages.forget(key);

        if (typeof value !== 'undefined') {
            deepSet(this.data, key, value);
        }

        this.runValidation(key);
    }

    /**
     * Run validation rules for the specified property and stop validation if needed
     */
    private runValidation(property: string): boolean {
        if (this.rules.hasOwnProperty(property) && Array.isArray(this.rules[property])) {
            for (let i = 0; i < this.rules[property].length; i++) {
                this.validateAttribute(property, this.rules[property][i]);

                if (this.messages.keys().length > 0 && this.stopOnFirstFailureFlag === true) {
                    return false;
                }

                if (this.shouldStopValidating(property)) {
                    break;
                }
            }
        }
    }

    /**
     * Check if we should stop further validations on a given attribute.
     */
    private shouldStopValidating(attribute: string): boolean {
       return this.messages.has(attribute) && validationRuleParser.hasRule(attribute, ['bail'], this.rules);
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
    };

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
        const validatable: boolean = this.isValidatable(attribute, value, rule);

        if (rule instanceof RuleContract) {
            return validatable ? this.validateUsingCustomRule(attribute, value, rule) : null;
        }

        const method = `validate${builValidationdMethodName(rule)}`;

        if (rule !== '' && typeof this.validateAttributes[method] === 'undefined') {
            throw `Rule ${rule} is not valid`;
        }

        if (validatable &&
                !this.validateAttributes[method](value, parameters, attribute)
        ) {
            this.addFailure(attribute, rule, value, parameters);
        }

    };

    /**
     * Validate an attribute using a custom rule object
     */
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
                error_type: rule.constructor.name, message: this.makeReplacements(
                    messages[key], this.getDisplayableAttribute(attribute), rule.constructor.name
                )
            });
        }

    };

    /**
     * Add a new error message to the messages object
     */
    private addFailure(attribute: string, rule: string, value: any, parameters: string[]): void {

        const hasNumericRule = validationRuleParser.hasRule(attribute, getNumericRules(), this.rules);
        const primaryAttribute: string = this.getPrimaryAttribute(attribute);
        const attributes: string[] = attribute !== primaryAttribute ? 
            [attribute, primaryAttribute] : [attribute];

        const message: string = this.makeReplacements(
            getMessage(attributes, rule, value, this.customMessages, hasNumericRule, this.lang),
            this.getDisplayableAttribute(attribute), rule, parameters, hasNumericRule
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
    };

    /**
     * Determine if the attribute is validatable.
     */
    private isValidatable(attribute: string, value: any, rule: Rule): boolean {
        return  this.presentOrRuleIsImplicit(attribute, value, rule) &&
                this.passesOptionalCheck(attribute) &&
                this.isNotNullIfMarkedAsNullable(attribute, rule);
    };

    
    /**
     * Determine if the field is present, or the rule implies required.
     */
    private presentOrRuleIsImplicit(attribute: string, value: any, rule: Rule) {
        if (typeof value === 'string' && value.trim() === '') {
            return isImplicitRule(rule)
        }

        return typeof deepFind(this.data, attribute) !== 'undefined' || 
               isImplicitRule(rule);
    }

    /**
     * Determine if the attribute passes any optional check.
     */
    private passesOptionalCheck(attribute: string): boolean {
        if (! validationRuleParser.hasRule(attribute, ['sometimes'], this.rules)) {
            return true;
        }

        const data = validationData.initializeAndGatherData(attribute, this.data);

        return data.hasOwnProperty(attribute)
            || this.data.hasOwnProperty(attribute);
    };

    /**
     * Determine if the attribute fails the nullable check.
     */
    private isNotNullIfMarkedAsNullable(attribute: string, rule: Rule): boolean {
        if (isImplicitRule(rule) || ! validationRuleParser.hasRule(attribute, ['nullable'], this.rules)) {
            return true;
        }

        return deepFind(this.data, attribute) !== null;
    };


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
    };

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
