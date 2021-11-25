'use strict';

import { ValidateAttributeInterface } from "../types";

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
};

export default validateAttributes;