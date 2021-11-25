'use strict';

export interface Rules {
    [key: string]: string|string[]
};

export interface Messages {
    [key: string]: string
};

export interface ValidationRuleParserInterface {
    explodeRules: (rules: Rules) => Rules;

    explodeExplicitRules(rule: string|string[]): string[];

    parseStringRule(rule: string): [string, string[]];

    parseParameters(rule: string, parameter: string): string[];
}

export interface ValidateAttributeInterface {
    validateRequired: (attribute: string, value: any) => boolean;
}