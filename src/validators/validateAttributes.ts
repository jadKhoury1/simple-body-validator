'use strict';

import { Rules } from "../types";
import { toDate } from '../utils/date';
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
     *  Validate the date is before a given date. 
     */
     validateBefore(value: any, parameters: string[]): boolean {
        this.requireParameterCount(1, parameters, 'before');
        return this.compareDates(value, parameters[0], '<', 'before');
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
    }

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
        }

        return true;
    };

    /**
     * 
     * Validate that an attribute exists when another atteribute has a given value
     */
    validateRequiredIf(value: any, parameters: string[]): boolean {
        this.requireParameterCount(2, parameters, 'required_if');

        if (!this.data.hasOwnProperty(parameters[0])) {
            return true;
        }

        const other = this.data[parameters[0]];
        const values = parameters.slice(1);

        if (values.indexOf(other) !== -1) {
            return this.validateRequired(value);
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
    validateGt(value: any, parameters: any[]): boolean {
        this.requireParameterCount(1, parameters, 'gt');

        const compartedToValue = this.data[parameters[0]];

        if (typeof compartedToValue === 'undefined' && (isNaN(value) === false && isNaN(parameters[0]) === false)) {
            return value > parameters[0];
        }

        if (isNaN(parameters[0]) === false) {
            return false;
        }

        if (isNaN(value) !== false &&  isNaN(compartedToValue) !== false) {
            return value > compartedToValue;
        }

        if (sameType(value, compartedToValue) === false) {
            return false;
        }

        return getSize(value) > getSize(compartedToValue);

    };

    /**
     * Validate that an attribute is greater than or equal  another attribute.
     */
    validateGte(value: any, parameters: any[]): boolean {
        this.requireParameterCount(1, parameters, 'gte');

        const compartedToValue = this.data[parameters[0]];

        if (typeof compartedToValue === 'undefined' && (isNaN(value) === false && isNaN(parameters[0]) === false)) {
            return value >= parameters[0];
        }

        if (isNaN(parameters[0]) === false) {
            return false;
        }

        if (isNaN(value) !== false &&  isNaN(compartedToValue) !== false) {
            return value >= compartedToValue;
        }

        if (sameType(value, compartedToValue) === false) {
            return false;
        }

        return getSize(value) >= getSize(compartedToValue);
    };

    /**
     * Validate that an attribute is less than another attribute.
     */
    validateLt(value: any, parameters: any[]): boolean {
        this.requireParameterCount(1, parameters, 'lt');

        const compartedToValue = this.data[parameters[0]];

        if (typeof compartedToValue === 'undefined' && (isNaN(value) === false && isNaN(parameters[0]) === false)) {
            return value < parameters[0];
        }

        if (isNaN(parameters[0]) === false) {
            return false;
        }

        if (isNaN(value) !== false &&  isNaN(compartedToValue) !== false) {
            return value < compartedToValue;
        }

        if (sameType(value, compartedToValue) === false) {
            return false;
        }

        return getSize(value) < getSize(compartedToValue);
    };

    /**
     * Validate that an attribute is less than or equal another attribute.
     */
    validateLte(value: any, parameters: any[]): boolean {
        this.requireParameterCount(1, parameters, 'lte');

        const compartedToValue = this.data[parameters[0]];

        if (typeof compartedToValue === 'undefined' && (isNaN(value) === false && isNaN(parameters[0]) === false)) {
            return value <= parameters[0];
        }

        if (isNaN(parameters[0]) === false) {
            return false;
        }

        if (isNaN(value) !== false &&  isNaN(compartedToValue) !== false) {
            return value <= compartedToValue;
        }

        if (sameType(value, compartedToValue) === false) {
            return false;
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
     * Always returns true - this method will be used in conbinatio with other rules
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

        const compartedToValue = toDate(this.data[parameter] || parameter);

        if (!compartedToValue) {
            throw `Validation rule ${rule} requires the parameter to be a date.`;
        }

        return compare(value, compartedToValue, operator);
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