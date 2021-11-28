'use strict';

import { ValidateAttributeInterface } from "../types";
import { getSize } from '../utils/general';

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

    validateString: function(value: any): boolean {
        return typeof value === 'string';
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
     * Validate that an attribute is a valid email address
     */
    validateEmail: function(value: any): boolean {
        if (typeof value !== 'string') {
            return false;
        }

        return value.toLowerCase().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) !== null;
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