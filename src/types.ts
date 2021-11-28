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
};

export interface ValidateAttributeInterface {
    validateRequired: (value: any) => boolean;
    validateArray: (value: any) => boolean;
    validateBetween: (value: any, parameters: number[]) => boolean;
    requireParameterCount: (count: number, parameters: number[], rule: string) => void;
    validateBoolean: (value: any) => boolean;
    validateString: (value: any) => boolean;
    validateEmail: (value: any) => boolean;
    validateRequiredIf: (value: any, parameters: string[], data: object) => boolean;
    validateRegex: (value: any, parameters: string[]) => boolean;
    validateNotRegex: (value: any, parameters: string[]) => boolean;
};

export interface ReplaceAttribueInterface {
    replaceBetween: (message: string, parameters: string[]) => string;
    replaceMin: (message: string, parameters: string[]) => string;
    replaceMax: (message: string, parameters: string[]) => string;
    replaceRequiredWith: (message: string, parameters: string[]) => string;
    replaceRequiredWithAll: (message: string, parameters: string[]) => string;
    replaceRequiredWithout: (message: string, parameters: string[]) => string;
    replaceRequiredWithoutAll: (message: string, parameters: string[]) => string;
    replaceGt: (message: string, parameters: string[], data: object) => string;
    replaceLt: (message: string, parameters: string[], data: object) => string;
    replaceGte: (message: string, parameters: string[], data: object) => string;
    replaceLte: (message: string, parameters: string[], data: object) => string;
    replaceRequiredIf: (message: string, parameters: any) => string;
};