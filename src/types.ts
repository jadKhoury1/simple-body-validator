'use strict';

import RuleContract  from './rules/ruleContract';
import BaseRule from './rules/baseRule';
import replaceAttributePayload from './payloads/replaceAttributePayload';


export interface GenericObject {
    [key: string]: any
};

export type InitialRule = string|ValidationCallback|RuleContract|BaseRule;

export type Rule = string|RuleContract;

export interface InitialRules extends GenericObject {
    [key: string]: string|object|InitialRule[]
};

export interface Rules extends GenericObject {
    [key: string]: Rule[]
};

export interface ImplicitAttributes {
    [key: string]: string[]
}

export interface CustomMesages extends GenericObject {};

export interface CustomAttributes extends GenericObject {};

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
    replaceAcceptedIf: (payload: replaceAttributePayload) => string;
    replaceBefore: (payload: replaceAttributePayload) => string;
    replaceBeforeOrEqual: (payload: replaceAttributePayload) => string;
    replaceAfter: (payload: replaceAttributePayload) => string;
    replaceAfterOrEqual: (payload: replaceAttributePayload) => string;
    replaceBetween: (payload: replaceAttributePayload) => string;
    replaceDateEquals: (payload: replaceAttributePayload) => string;
    replaceDeclinedIf: (payload: replaceAttributePayload) => string;
    replaceDigits: (payload: replaceAttributePayload) => string;
    replaceDigitsBetween: (payload: replaceAttributePayload) => string;
    replaceDifferent: (payload: replaceAttributePayload) => string;
    replaceEndsWith: (payload: replaceAttributePayload) => string;
    replaceMin: (payload: replaceAttributePayload) => string;
    replaceMax: (payload: replaceAttributePayload) => string;
    replaceRequiredWith: (payload: replaceAttributePayload) => string;
    replaceRequiredWithAll: (payload: replaceAttributePayload) => string;
    replaceRequiredWithout: (payload: replaceAttributePayload) => string;
    replaceRequiredWithoutAll: (payload: replaceAttributePayload) => string;
    replaceGt: (payload: replaceAttributePayload) => string;
    replaceLt: (payload: replaceAttributePayload) => string;
    replaceGte: (payload: replaceAttributePayload) => string;
    replaceLte: (payload: replaceAttributePayload) => string;
    replaceRequiredIf: (payload: replaceAttributePayload) => string;
    replaceStartsWith: (payload: replaceAttributePayload) => string;
    replaceRequiredUnless: (payload: replaceAttributePayload) => string;
    replaceSame: (payload: replaceAttributePayload) => string;
    replaceSize: (payload: replaceAttributePayload) => string;
};


export interface LangInterface {
    defaultLang: string;
    fallbackLang: string;
    existingLangs: string[];
    translations: object;
    messages: object;
    defaultMessages: object;
    fallbackMessages: object;
    path: string;
    get: (lang: string) => object;
    setTranslationObject: (translations: object) => void;
    setPath: (path: string) => void;
    setDefaultLang: (lang: string) => void;
    setFallbackLang: (lang: string) => void;
    getDefaultLang: () => string;
    load: (lang: string) => void;
};

export type ValidationCallback = (value: any, fail: (message: string) => void, attribute) => void;