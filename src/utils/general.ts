'use strict';


/**
 * Get the size of a value based on its type
 */
export function getSize(value: any, hasNumericRule: boolean = false): number {

    if (typeof value === 'number' || (isNaN(value) === false && hasNumericRule === true)) {
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
 * Check if Value is an Ineteger
 */
export function isInteger(value: any): boolean {
    return isNaN(value) === false && value % 1 === 0;
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
 * Returns the numeric rules
 */
export function getNumericRules() {
    return ['numeric', 'integer'];
};

/**
 * Check if the rule is numeric
 */
export function isNumericRule(rule: string): boolean {
   
    const numericRules = getNumericRules();

    return numericRules.indexOf(rule) !== -1;
};

/**
 * Determine if a comparison passes between the given values.
 */
export function compare(first: any, second: any, operator: string, strict: boolean = false): boolean {
    switch(operator) {
        case '<': 
            return first < second;
        case '>':
            return first > second;
        case '<=':
            return first <= second;
        case '>=':
            return first >= second;
        case '=':
            if (strict === true) {
                return first === second;
            }
            return first == second;
        default:
            throw 'Invalid operator parameter';
    }
}