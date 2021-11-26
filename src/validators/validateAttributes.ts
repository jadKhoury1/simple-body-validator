'use strict';

import { ValidateAttributeInterface } from "../types";
import { getSize } from '../utils/general';

const validateAttributes: ValidateAttributeInterface = {
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
    validateArray: function(value: any) {
        return Array.isArray(value);
    },
    validateBetween: function(value: any, parameters: number[]) {
        this.requireParameterCount(2, parameters, 'between');

        const size = getSize(value);
        const [min, max] = parameters;

        return size >= min && size <= max;
    },
    requireParameterCount: function(count: number, parameters: number[], rule: string) {
        if (parameters.length < count) {
            throw `Validation rule ${rule} requires at lesat ${count} paramters.`;
        }
    },
};

export default validateAttributes;