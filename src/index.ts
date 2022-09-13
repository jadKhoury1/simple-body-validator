import { CustomAttributes, CustomMesages, InitialRules } from './types';
import Validator from './validator';
import Lang from './lang';
import RuleContract from './rules/ruleContract';
import ImplicitRuleContract from './rules/implicitRuleContract';
import { default as PasswordRule } from './rules/password';


export class Rule extends RuleContract {};
export class ImplicitRule extends ImplicitRuleContract {};
export class Password extends PasswordRule {};

export * from './rules/registerRule';
export * from './rule';

export function make(data: object = {}, rules: InitialRules = {}, customMessages: CustomMesages = {}, customAttributes: CustomAttributes = {}): Validator {
    return new Validator(data, rules, customMessages, customAttributes);
};

export function setDefaultLang(lang: string): void {
    Lang.setDefaultLang(lang);
};

export function setFallbackLang(lang: string): void {
    Lang.setFallbackLang(lang);
};

export function setTranslationPath(path: string): void {
    Lang.setPath(path);
};

export function setTranslationObject(translations: object): void {
    Lang.setTranslationObject(translations);
};

