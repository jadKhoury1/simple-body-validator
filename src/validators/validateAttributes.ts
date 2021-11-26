'use strict';

import { ValidateAttributeInterface } from "../types";
import { getSize } from '../utils/general';

const validateAttributes: ValidateAttributeInterface = {

    /**
     * Validate that a required attribute exists
     */
    validateRequired: function(value: any) {
        if (value === null || typeof value === 'undefined') {
            return false;
        } else if (typeof value === 'string' || value.trim() === '') {
            return false;
        } else if (Array.isArray(value) && value.length < 1) {
            return false;
        }

        return true;
    },

    /**
     * Validate that an attribute is an array 
     */
    validateArray: function(value: any) {
        return Array.isArray(value);
    },

    /**
     * Validate that an attribute is boolean
     */
    validateBoolean: function(value: any) {
        const acceptable = [true, false, 0, 1, '0', '1'];

        return acceptable.indexOf(value) !== -1;
    },

    /**
     * Validate the size of an attribute is between a set of values
     */
    validateBetween: function(value: any, parameters: number[]) {
        this.requireParameterCount(2, parameters, 'between');

        const size = getSize(value);
        const [min, max] = parameters;

        return size >= min && size <= max;
    },

    /**
     * Validate that an attribute is a valid email address
     */
    validateEmail: function(value: any) {
        if (typeof value !== 'string') {
            return false;
        }

        return value.toLowerCase().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) !== null;
    },

    /**
     * Require a certain number of parameters to be present
     */
    requireParameterCount: function(count: number, parameters: number[], rule: string) {
        if (parameters.length < count) {
            throw `Validation rule ${rule} requires at lesat ${count} paramters.`;
        }
    },
};

export default validateAttributes;