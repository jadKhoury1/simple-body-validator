'use strict';

import { ValidateAttributeInterface } from "../types";
import { getSize, sameType } from '../utils/general';

const validateAttributes: ValidateAttributeInterface = {

    /**
     * Validate that a required attribute exists
     */
    validateRequired: function(value: any): boolean {

        if (value === null || typeof value === 'undefined') {
            return false;
        } else if (typeof value === 'string' && value.trim() === '') {
            return false;
        } else if (Array.isArray(value) && value.length < 1) {
            return false;
        }

        return true;
    },

    /**
     * 
     * Validate that an attribute exists when another atteribute has a given value
     */
    validateRequiredIf: function(value: any, parameters: string[], data: object): boolean {
        this.requireParameterCount(2, parameters, 'required_if');

        if (!data.hasOwnProperty(parameters[0])) {
            return true;
        }

        const other = data[parameters[0]];
        const values = parameters.slice(1);

        if (values.indexOf(other) !== -1) {
            return this.validateRequired(value);
        }

        return true;
    },

    /**
     * Validate that an attribute is an array 
     */
    validateArray: function(value: any): boolean {
        return Array.isArray(value);
    },

    /**
     * Validate that an attribute is boolean
     */
    validateBoolean: function(value: any): boolean {
        const acceptable = [true, false, 0, 1, '0', '1'];

        return acceptable.indexOf(value) !== -1;
    },

    /**
     * Validate that an attribute is a string.
     */
    validateString: function(value: any): boolean {
        return typeof value === 'string';
    },

    /**
     * Validate that an attribute is numeric.
     */
    validateNumeric: function(value: any): boolean {
        return isNaN(value) === false;
    },

    /**
     * Validate that an attribute is an integer.
     */
    validateInteger: function (value: any): boolean {
        return value % 1 === 0;
    },

    /**
     * Validate the size of an attribute is between a set of values
     */
    validateBetween: function(value: any, parameters: number[]): boolean {
        this.requireParameterCount(2, parameters, 'between');

        const size = getSize(value);
        const [min, max] = parameters;

        return size >= min && size <= max;
    },

    /**
     * Validate that an attribute is greater than another attribute.
     */
    validateGt: function(value: any, parameters: any[], data: object): boolean {
        this.requireParameterCount(1, parameters, 'gt');

        const compartedToValue = data[parameters[0]];

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

    },

    /**
     * Validate that an attribute is greater than or equal  another attribute.
     */
    validateGte: function(value: any, parameters: any[], data: object): boolean {
        this.requireParameterCount(1, parameters, 'gte');

        const compartedToValue = data[parameters[0]];

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
    },

    /**
     * Validate that an attribute is less than another attribute.
     */
    validateLt: function(value: any, parameters: any[], data: object): boolean {
        this.requireParameterCount(1, parameters, 'lt');

        const compartedToValue = data[parameters[0]];

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
    },

    /**
     * Validate that an attribute is less than or equal another attribute.
     */
    validateLte: function(value: any, parameters: any[], data: object): boolean {
        this.requireParameterCount(1, parameters, 'lte');

        const compartedToValue = data[parameters[0]];

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
    },


    /**
     * Validate that an attribute is a valid email address.
     */
    validateEmail: function(value: any): boolean {
        if (typeof value !== 'string') {
            return false;
        }

        return value.toLowerCase().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) !== null;
    },

    /**
     * Validate an attribute is contained within a list of values.
     */
    validateIn: function(value: any, paramters: string[]): boolean {
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
  
    },

    /**
     * Validate an attribute is not contained within a list of values.
     */
    validateNotIn: function (value: any, parameters: string[]): boolean {
        return !this.validateIn(value, parameters);
    },

    /**
     * Validate that an attribute passes a regular expression check.
     */
    validateRegex: function(value: any, parameters: string[]): boolean {
        if (typeof value !== 'string') {
            return false;
        }

        this.requireParameterCount(1, parameters, 'regex');

        return value.match(/^[a-z]* [a-z]*/) === null ? false : true;
    },

     /**
      * Validate that an attribute does not pass a regular expression check.
      */
    validateNotRegex: function(value: any, parameters: string[]): boolean {
        if (typeof value !== 'string') {
            return false;
        }

        this.validateNotRegex(1, parameters, 'not_regex');

        return value.match(/^[a-z]* [a-z]*/) === null ? true : false;
    },

    /**
     * Require a certain number of parameters to be present
     */
    requireParameterCount: function(count: number, parameters: number[], rule: string): void {
        if (parameters.length < count) {
            throw `Validation rule ${rule} requires at least ${count} paramters.`;
        }
    },

};

export default validateAttributes;