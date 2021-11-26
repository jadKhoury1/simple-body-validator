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
    validateRequired: (value: any) => boolean;
    validateArray: (value: any) => boolean;
    validateBetween: (value: any, paraters: number[]) => boolean;
    requireParameterCount: (count: number, parameters: number[], rule: string) => void;
    validateBoolean: (value: any) => boolean;
}