'use strict';

export function getSize(value: any): number {
    if (typeof value === 'number') {
        return value;
    } else if (typeof value === 'string' ||  Array.isArray(value)) {
        return value.length;
    }

    return -1;
};


export function isSizeRule(rule: string): boolean {

    const sizeRules = [
        'size', 'between', 'min', 'max', 'gt', 'lt', 'gte', 'lte'
    ];

    return sizeRules.indexOf(rule) !== -1;
};

export function isNumericRule(rule: string): boolean {
   
    const numericRules = ['numeric', 'integer'];

    return numericRules.indexOf(rule) !== -1;
};