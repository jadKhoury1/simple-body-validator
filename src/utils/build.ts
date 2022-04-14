'use strict';

export function builValidationdMethodName(rule: string): string {
    if (!rule) {
        return rule;
    }
    
    return rule.split('_').map(rule => `${rule[0].toUpperCase()}${rule.slice(1)}`).join('');
};