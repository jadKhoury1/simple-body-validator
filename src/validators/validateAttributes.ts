'use strict';

import { Rules } from '../types';
import { toDate } from '../utils/date';
import { deepFind } from '../utils/object';
import { getSize, sameType, getNumericRules, isInteger, compare } from '../utils/general';
import validationRuleParser from './validationRuleParser';

class ValidateAttributes {

    /**
     * Stores the data object
     */
    data: object;

    /**
     * Stores the rules object
     */
    rules: Rules;

    constructor(data: object, rules: Rules) {
        this.data = data;
        this.rules = rules;
    };


    /**
     *  Validate the date is after a given date. 
     */
    validateAfter(value: any, parameters: string[]): boolean {
        this.requireParameterCount(1, parameters, 'after');
        return this.compareDates(value, parameters[0], '>', 'after');
    };

    /**
     * Validate the date is after or equal a given date. 
     */
    validateAfterOrEqual(value: any, parameters: string[]): boolean {
        this.requireParameterCount(1, parameters, 'after_or_equal');
        return this.compareDates(value, parameters[0], '>=', 'after_or_equal');
    };


    /**
     * Validate that an attribute contains only alphabetic characters.
     */
    validateAlpha(value: any): boolean {

        const regex = /^[a-zA-Z]+$/;
        return typeof value === 'string' && regex.test(value);
    };

    /**
     * Validate that an attribute contains only alpha-numeric characters, dashes, and underscores.
     */
    validateAlphaDash(value: any): boolean {

        if (typeof value != 'string' && typeof value != 'number') {
            return false;
        }

        const regex = /^[a-zA-Z0-9-_]+$/;
        return regex.test(value.toString());
    };

    /**
     * Validate that an attribute contains only alpha-numeric characters.
     */
    validateAlphaNum(value: any): boolean {
        if (typeof value != 'string' && typeof value != 'number') {
            return false;
        }

        const regex = /^[a-zA-Z0-9]+$/;
        return regex.test(value.toString());
    }

    /**
     * Validate that an attribute is an array 
     */
    validateArray(value: any): boolean {
        return Array.isArray(value);
    };

    /**
     * Validate that an attribute is an object
     */
    validateObject(value: any): boolean {
        return typeof value === 'object' && !Array.isArray(value);
    };

    /**
     *  Validate the date is before a given date. 
     */
     validateBefore(value: any, parameters: string[]): boolean {
        this.requireParameterCount(1, parameters, 'before');
        return this.compareDates(value, parameters[0], '<', 'before');
    }

    /**
     * Validate the date is before or equal a given date.
     */
    validateBeforeOrEqual(value: any, parameters:string[]): boolean {
        this.requireParameterCount(1, parameters, 'before_or_equal');
        return this.compareDates(value, parameters[0], '<=', 'before_or_equal');
    }
    

    /**
     * Validate the size of an attribute is between a set of values
     */
     validateBetween(value: any, parameters: number[], attribute: string): boolean {

        if (typeof value !== 'string' && typeof value !== 'number' && !Array.isArray(value)) {
            throw 'Validation rule between requires the field under validation to be a number, string or array.';
        }

        this.requireParameterCount(2, parameters, 'between');
        let [min, max] = parameters;


        if (isNaN(min) || isNaN(max)) {
            throw 'Validation rule between requires both parameters to be numbers.';
        }

        min = Number(min);
        max = Number(max);

        if (min >= max) {
            throw 'Validation rule between requires that the first parameter be greater than the second one.';
        }

        const size = getSize(value, validationRuleParser.hasRule(attribute, getNumericRules(), this.rules));
        return size >= min && size <= max;
    };


    /**
     * Validate that an attribute is boolean
     */
    validateBoolean(value: any, parameters: number[], attribute: string): boolean {

        if (validationRuleParser.hasRule(attribute, 'strict', this.rules)) {
            return typeof value === 'boolean';
        }

        const acceptable = [true, false, 0, 1, '0', '1'];

        return acceptable.indexOf(value) !== -1;
    };


    /**
     * Validate that an attribute is a valid date.
     */
    validateDate(value: any): boolean {
        return toDate(value) ? true : false;
    };

    /**
     * Validate that an attribute is equal to another date.
     */
    validateDateEquals(value: any, paramters: string[]) {
        this.requireParameterCount(1, paramters, 'date_equals');

        return this.compareDates(value, paramters[0], '=', 'date_equals');
    };

    /**
     *  Validate that an attribute has a given number of digits.
     */
    validateDigits(value: any, parameters: any[]): boolean {

        this.requireParameterCount(1, parameters, 'digits');

        if (isInteger(parameters[0]) === false) {
            throw 'Validation rule digits requires the parameter to be an integer.';
        }

        if (parameters[0] <= 0) {
            throw 'Validation rule digits requires the parameter to be an integer greater than 0.';
        }

        if (typeof value !== 'string' && typeof value !== 'number') {
            return false;
        }

        value = value.toString();
        return /^\d+$/.test(value) && value.length === parseInt(parameters[0]);
    };
    
    /**
     * Validate that an attribute is between a given number of digits.
     */
    validateDigitsBetween(value: any, parameters: any[]): boolean {
        this.requireParameterCount(2, parameters, 'digits_between');

        let [min, max] = parameters;

        if (isInteger(min) === false || isInteger(max) === false) {
            throw 'Validation rule digits_between requires both parameters to be integers.';
        }

        min = parseInt(min);
        max = parseInt(max);

        if (min <= 0 || max <= 0) {
            throw 'Validation rule digits_between requires the parameters to be an integer greater than 0.';
        }

        if (min >= max) {
            throw 'Validation rule digits_between requires the max param to be greater than the min param.';
        }

        if (typeof value !== 'string' && typeof value !== 'number') {
            return false;
        }

        value = value.toString();
        const valueLength = value.length;

        return /^\d+$/.test(value) && valueLength >= min && valueLength <= max;
    };

    /**
     * Validate that an attribute is a valid email address.
     */
    validateEmail(value: any): boolean {
        if (typeof value !== 'string') {
            return false;
        }

        return value.toLowerCase().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) !== null;
    };

    /**
     * Validate the attribute ends with a given substring.
     */
    validateEndsWith(value: any, parameters: string[]): boolean {
        this.requireParameterCount(1, parameters, 'ends_with');

        if (typeof value !== 'string') {
            throw 'The field under validation must be a string';
        }

        const valueLength = value.length;

        for (let i = 0; i < parameters.length; i++) {
            if (typeof parameters[i] === 'string' && value.indexOf(parameters[i], valueLength - parameters[i].length) !== -1) {
                return true;
            }
        }

        return false;
    };

    /**
     * Validate the attribute starts with a given substring.
     */
    validateStartsWith(value: any, parameters: string[]): boolean {
        this.requireParameterCount(1, parameters, 'starts_with');

        if (typeof value !== 'string') {
            throw 'The field under validation must be a string';
        }

        for (let i = 0; i < parameters.length; i++) {
            if (typeof parameters[i] === 'string' && value.substr(0, parameters[i].length) === parameters[i]) {
                return true;
            }
        }

        return false;
    };

    /** 
     * Validate that a required attribute exists
     */
    validateRequired(value: any): boolean {

        if (value === null || typeof value === 'undefined') {
            return false;
        } else if (typeof value === 'string' && value.trim() === '') {
            return false;
        } else if (Array.isArray(value) && value.length < 1) {
            return false;
        } else if (typeof value === 'object' && Object.keys(value).length < 1) {
            return false;
        }

        return true;
    };

    /**
     * Validate that an attribute exists when another atteribute has a given value
     */
    validateRequiredIf(value: any, parameters: string[]): boolean {
        this.requireParameterCount(2, parameters, 'required_if');

        const other = deepFind(this.data, parameters[0]);

        if (!other) {
            return true;
        }

        const values = parameters.slice(1);

        if (values.indexOf(other) !== -1) {
            return this.validateRequired(value);
        }

        return true;
    };


    /**
     * Validate that an attribute exists when any other attribute exists.
     */
    validateRequiredWith(value: any, parameters: string[]): boolean {
        if (! this.allFailingRequired(parameters)) {
            return this.validateRequired(value);
        }

        return true;
    };

    /**
     * Validate that an attribute exists when all other attributes exist.
     */
    validateRequiredWithAll(value: any, parameters: string[]): boolean {
        if (! this.anyFailingRequired(parameters)) {
            return this.validateRequired(value);
        }

        return true;
    };

    /**
     * Validate that an attribute exists when another attribute does not.
     */
    validateRequiredWithout(value: any, parameters: string[]): boolean {
        if (this.anyFailingRequired(parameters)) {
            return this.validateRequired(value);
        }

        return true;
    };

    /**
     * Validate that an attribute exists when all other attributes do not.
     */
    validateRequiredWithoutAll(value: any, parameters: string[]): boolean {
        if (this.allFailingRequired(parameters)) {
            return this.validateRequired(value);
        }

        return true;
    };

    /**
     * Determine if any of the given attributes fail the required test.
     */
    anyFailingRequired(attributes: string[]): boolean  {
        for (let i = 0; i < attributes.length; i++) {
            if (! this.validateRequired(deepFind(this.data, attributes[i]))) {
                return true;
            }
        }

        return false;
    };

    /**
     * Determine if all of the given attributes fail the required test.
     */
    allFailingRequired(attributes: string[]): boolean {
        for (let i = 0; i < attributes.length; i++) {
            if (this.validateRequired(deepFind(this.data, attributes[i]))) {
                return false;
            }
        }

        return true;
    };

    /**
     * Validate that an attribute is a string.
     */
    validateString(value: any): boolean {
        return typeof value === 'string';
    };

    /**
     * Validate that an attribute is numeric.
     */
    validateNumeric(value: any): boolean {
        return isNaN(value) === false;
    };

    /**
     * Validate that an attribute is an integer.
     */
    validateInteger(value: any): boolean {
        return isInteger(value);
    };

    /**
     * Validate that an attribute is greater than another attribute.
     */
    validateGt(value: any, parameters: any[], attribute: string): boolean {
        this.requireParameterCount(1, parameters, 'gt');
        
        if (typeof value !== 'number' && typeof value !== 'string' && typeof value !== 'object') {
            throw 'The field under validation must be a number, string, array or object';
        }

        const compartedToValue = deepFind(this.data, parameters[0]) || parameters[0];
    
        if (!Array.isArray(compartedToValue) && isNaN(compartedToValue) === false) {
            return getSize(value, validationRuleParser.hasRule(attribute, getNumericRules(), this.rules)) > compartedToValue;
        }
    
        if (sameType(value, compartedToValue) === false) {
            throw 'The fields under validation must be of the same type';
        }

        return getSize(value) > getSize(compartedToValue);
    };

    /**
     * Validate that an attribute is greater than or equal  another attribute.
     */
    validateGte(value: any, parameters: any[], attribute: string): boolean {
        this.requireParameterCount(1, parameters, 'gte');

        if (typeof value !== 'number' && typeof value !== 'string' && typeof value !== 'object') {
            throw 'The field under validation must be a number, string, array or object';
        }

        const compartedToValue = deepFind(this.data, parameters[0]) || parameters[0];
    
        if (!Array.isArray(compartedToValue) && isNaN(compartedToValue) === false) {
            return getSize(value, validationRuleParser.hasRule(attribute, getNumericRules(), this.rules)) >= compartedToValue;
        }

        if (sameType(value, compartedToValue) === false) {
            throw 'The fields under validation must be of the same type';
        }

        return getSize(value) >= getSize(compartedToValue);
    };

    /**
     * Validate that an attribute is less than another attribute.
     */
    validateLt(value: any, parameters: any[], attribute: string): boolean {
        this.requireParameterCount(1, parameters, 'lt');

        if (typeof value !== 'number' && typeof value !== 'string' && typeof value !== 'object') {
            throw 'The field under validation must be a number, string, array or object';
        }

        const compartedToValue = deepFind(this.data, parameters[0]) || parameters[0];
    
        if (!Array.isArray(compartedToValue) && isNaN(compartedToValue) === false) {
            return getSize(value, validationRuleParser.hasRule(attribute, getNumericRules(), this.rules)) < compartedToValue;
        }

        if (sameType(value, compartedToValue) === false) {
            throw 'The fields under validation must be of the same type';
        }

        return getSize(value) < getSize(compartedToValue);
    };

    /**
     * Validate that an attribute is less than or equal another attribute.
     */
    validateLte(value: any, parameters: any[], attribute: string): boolean {
        this.requireParameterCount(1, parameters, 'lte');

        if (typeof value !== 'number' && typeof value !== 'string' && typeof value !== 'object') {
            throw 'The field under validation must be a number, string, array or object';
        }

        const compartedToValue = deepFind(this.data, parameters[0]) || parameters[0];
    
        if (!Array.isArray(compartedToValue) && isNaN(compartedToValue) === false) {
            return getSize(value, validationRuleParser.hasRule(attribute, getNumericRules(), this.rules)) <= compartedToValue;
        }

        if (sameType(value, compartedToValue) === false) {
            throw 'The fields under validation must be of the same type';
        }

        return getSize(value) <= getSize(compartedToValue);
    };


    /**
     * Validate an attribute is contained within a list of values.
     */
    validateIn(value: any, paramters: string[]): boolean {
        if (Array.isArray(value)) {
            for (let index = 0; index < value.length; index++) {
                if (typeof value[index] !== 'number' && typeof value[index] !== 'string') {
                    return false;
                }
            }
            return value.filter(element => paramters.indexOf(element.toString()) === -1).length === 0;
        };

        if (typeof value !== 'number' && typeof value !== 'string') {
            return false;
        }

        return paramters.indexOf(value.toString()) !== -1;
  
    };

    /**
     * Validate an attribute is not contained within a list of values.
     */
    validateNotIn(value: any, parameters: string[]): boolean {
        return !this.validateIn(value, parameters);
    };

    /**
     * Validate that an attribute passes a regular expression check.
     */
    validateRegex(value: any, parameters: string[]): boolean {
        if (typeof value !== 'string') {
            return false;
        }

        this.requireParameterCount(1, parameters, 'regex');

        return value.match(/^[a-z]* [a-z]*/) === null ? false : true;
    };

     /**
      * Validate that an attribute does not pass a regular expression check.
      */
    validateNotRegex(value: any, parameters: string[]): boolean {
        if (typeof value !== 'string') {
            return false;
        }

        this.requireParameterCount(1, parameters, 'not_regex');

        return value.match(/^[a-z]* [a-z]*/) === null ? true : false;
    };

    /**
     * Always returns true - this method will be used in conbination with other rules
     */
    validateStrict() {
        return true;
    }


    /**
    *  Determine if a comparison passes between the given values.
    */
    compareDates(value: any, parameter: any, operator: string, rule: string): boolean {
        value = toDate(value);

        if (!value) {
            throw `Validation rule ${rule} requires the field under valation to be a date.`;
        }

        const compartedToValue = toDate(deepFind(this.data, parameter) || parameter);

        if (!compartedToValue) {
            throw `Validation rule ${rule} requires the parameter to be a date.`;
        }

        return compare(value.getTime(), compartedToValue.getTime(), operator);
    }

    /**
     * Require a certain number of parameters to be present
     */
    requireParameterCount(count: number, parameters: string[]|number[], rule: string): void {
        if (parameters.length < count) {
            throw `Validation rule ${rule} requires at least ${count} parameters.`;
        }
    };


};

export default ValidateAttributes;