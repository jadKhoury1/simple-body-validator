'use strict';

/**
 * Get the size of a value based on its type
 */
export function getSize(value: any): number {
    if (isNaN(value) === false) {
        return Number(value);
    } else if (typeof value === 'string' ||  Array.isArray(value)) {
        return value.length;
    }

    return -1;
};

/**
 * Check if two values are of the same type
 */
export function sameType(value: any, otherValue: any): boolean {

    const valueType = Array.isArray(value) ? 'array' : typeof value;
    const otherValueType = Array.isArray(otherValue) ? 'array' : typeof otherValue;
    return valueType == otherValueType;

};


/**
 * Check if the rule is related to size
 */
export function isSizeRule(rule: string): boolean {

    const sizeRules = [
        'size', 'between', 'min', 'max', 'gt', 'lt', 'gte', 'lte'
    ];

    return sizeRules.indexOf(rule) !== -1;
};

/**
 * Check if the rule is numeric
 */
export function isNumericRule(rule: string): boolean {
   
    const numericRules = ['numeric', 'integer'];

    return numericRules.indexOf(rule) !== -1;
};
