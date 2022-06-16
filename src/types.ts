'use strict';

import RuleContract  from './rules/ruleContract';
import BaseRule from './rules/baseRule';


export interface GenericObject {
    [key: string]: any
};

export type InitialRule = string|ValidationCallback|RuleContract|BaseRule;

export type Rule = string|RuleContract;

export interface InitialRules extends GenericObject {
    [key: string]: string|InitialRule[]
};

export interface Rules extends GenericObject {
    [key: string]: Rule[]
};

export interface ImplicitAttributes {
    [key: string]: string[]
}

export interface CustomMesages {
    [key: string]: string
};

export interface ErrorMessage {
    error_type?: string,
    message: string,
};

export interface Errors {
    [key: string]: ErrorMessage[]
};


export interface Messages {
    [key: string]: string[]
}

export interface ValidationRuleParserInterface {
    explodeRules: (rules: Rules, data: object) => { rules: Rules, implicitAttributes: ImplicitAttributes};
    explodeWildCardRules:(results: object, attribute: string, data: object, implicitAttributes: ImplicitAttributes) => object;
    explodeExplicitRules: (rule: string|InitialRule[]) => Rule[];
    prepareRule: (rule: InitialRule) => Rule;
    mergeRulesForAttribute: (results: object, attribute: string, rules: string|string[]) => object;
    parse: (rule: Rule) => [Rule, string[]];
    parseStringRule: (rule: string) => [string, string[]];
    parseParameters: (rule: string, parameter: string) => string[];
    getRule: (attribute: string, searchRules: string|string[], availableRules: Rules) => Partial<[string, string[]]>;
    hasRule: (attrtibute: string, searchRules: string|string[], availableRules: Rules) => boolean; 
};

export interface ValidationDataInterface {
    initializeAndGatherData: (attribute: string, masterData: object) => object;
    initializeAttributeOnData: (attribute: string, masterData: object) => object;
    extractValuesFromWildCards: (masterData: object, data: object, attribute: string) => object;
    getLeadingExplicitAttributePath: (attribute: string) => string;
    extractDataFromPath: (path: string, masterData: object) => object;
};

export interface ReplaceAttribueInterface {
    replaceAcceptedIf: (message: string, parameters: string[], data: object) => string;
    replaceBefore: (message: string, parameters: string[]) => string;
    replaceBeforeOrEqual: (message: string, parameters: string[]) => string;
    replaceAfter: (message: string, parameters: string[]) => string;
    replaceAfterOrEqual: (message: string, parameters: string[]) => string;
    replaceBetween: (message: string, parameters: string[]) => string;
    replaceDateEquals: (message: string, parameters: string[]) => string;
    replaceDeclinedIf: (message: string, paramaters: string[], data: object) => string;
    replaceDigits: (message: string, paramaters: string[]) => string;
    replaceDigitsBetween: (message: string, paramters: string[]) => string;
    replaceDifferent: (message: string, parameters: string[]) => string;
    replaceEndsWith: (message: string, paramters: string[]) => string;
    replaceMin: (message: string, parameters: string[]) => string;
    replaceMax: (message: string, parameters: string[]) => string;
    replaceRequiredWith: (message: string, parameters: string[]) => string;
    replaceRequiredWithAll: (message: string, parameters: string[]) => string;
    replaceRequiredWithout: (message: string, parameters: string[]) => string;
    replaceRequiredWithoutAll: (message: string, parameters: string[]) => string;
    replaceGt: (message: string, parameters: string[], data: object, hasNumericRule: boolean) => string;
    replaceLt: (message: string, parameters: string[], data: object, hasNumericRule: boolean) => string;
    replaceGte: (message: string, parameters: string[], data: object, hasNumericRule: boolean) => string;
    replaceLte: (message: string, parameters: string[], data: object, hasNumericRule: boolean) => string;
    replaceRequiredIf: (message: string, parameters: string[], data: object) => string;
    replaceStartsWith: (message: string, paramters: string[]) => string;
    replaceRequiredUnless: (message: string, parameters: string[]) => string;
    replaceSame: (message: string, parameters: string[]) => string;
    replaceSize: (message: string, parameters: string[]) => string;
};


export interface LangInterface {
    defaultLang: string;
    existingLangs: string[];
    messages: object;
    defaultMessages: object;
    path: string;
    get: (lang: string) => object;
    setPath: (path: string) => void;
    setDefaultLang: (lang: string) => void;
    getDefaultLang: () => string;
    load: (lang: string) => void;
};

export type ValidationCallback = (value: any, fail: (message: string) => void, attribute) => void;