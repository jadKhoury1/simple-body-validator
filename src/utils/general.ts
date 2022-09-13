'use strict';

import RuleContract from '../rules/ruleContract';
import BaseRule from '../rules/baseRule';
import { Rule } from '../types';
import ImplicitRuleContract from '../rules/implicitRuleContract';


const implicitRues: string[] = [
    'accepted', 'accepted_if', 'declined', 'declined_if', 
    'filled', 'present', 'required', 'required_if', 'required_unless',
    'required_with', 'required_with_all', 'required_without', 'required_without_all'
];

/**
 * Get the size of a value based on its type
 */
export function getSize(value: any, hasNumericRule: boolean = false): number {

    if (typeof value === 'number' || (isNaN(value) === false && hasNumericRule === true)) {
        return Number(value);
    } else if (typeof value === 'string' ||  Array.isArray(value)) {
        return value.length;
    } else if (typeof value === 'object' && value !== null) {
        return Object.keys(value).length;
    }

    return -1;
};

/**
 * Check if two values are of the same type
 */
export function sameType(value: any, otherValue: any): boolean {

    const valueType = Array.isArray(value) ? 'array' : typeof value;
    const otherValueType = Array.isArray(otherValue) ? 'array' : typeof otherValue;
    return valueType === otherValueType;

};


/**
 * Check if Value is an Ineteger
 */
export function isInteger(value: any): boolean {
    return value !== null && isNaN(value) === false && value % 1 === 0;
};

/**
 * Check if the value can be considered as rule
 */
export function isRule(value: any): boolean {
    return typeof value === 'string' || 
           typeof value === 'function' ||
           value instanceof RuleContract ||
           value instanceof BaseRule;

};

/**
 * Check if the array contain any potentiel valid rule
 */
export function isArrayOfRules(values: any[]): boolean {
    for (let i = 0; i < values.length; i++) {
        if (isRule(values[i])) {
            return true;
        }
    }

    return false;
}

/**
 * Check if the rule is related to size
 */
export function isSizeRule(rule: string): boolean {

    const sizeRules: string[] = [
        'size', 'between', 'min', 'max', 'gt', 'lt', 'gte', 'lte'
    ];

    return sizeRules.indexOf(rule) !== -1;
};


/**
 * Check if rule implies that the field is required
 */
export function isImplicitRule(rule: Rule): boolean {

    if (rule instanceof ImplicitRuleContract) {
        return true;
    }

    if (typeof rule === 'string') {
        return implicitRues.indexOf(rule) !== -1;
    }

    return false;
};

/**
 * Add a new implicit rule
 */
export function addImplicitRule(rule: string): void {
    implicitRues.push(rule);
}


/**
 * Returns the numeric rules
 */
export function getNumericRules(): string[] {
    return ['numeric', 'integer'];
};

/**
 * Check if the rule is numeric
 */
export function isNumericRule(rule: string): boolean {
   
    const numericRules: string[] = getNumericRules();

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