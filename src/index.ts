import { CustomAttributes, CustomMesages, InitialRules, InitialRule } from './types';
import Validator from './validator';
import Lang from './lang';
import ErrorBag from './validators/errorBag';
import RuleContract from './rules/ruleContract';
import ImplicitRuleContract from './rules/implicitRuleContract';
import { default as PasswordRule } from './rules/password'; 


class Rule extends RuleContract {};
class ImplicitRule extends ImplicitRuleContract {};
class Password extends PasswordRule {};

function make(data: object = {}, rules: InitialRules = {}, customMessages: CustomMesages = {}, customAttributes: CustomAttributes = {}): Validator {
    return new Validator(data, rules, customMessages, customAttributes);
};

function setDefaultLang(lang: string): void {
    Lang.setDefaultLang(lang);
};

function setFallbackLang(lang: string): void {
    Lang.setFallbackLang(lang);
};

function setTranslationObject(translations: object): void {
    Lang.setTranslationObject(translations);
};

export {
    Rule,
    ImplicitRule,
    InitialRules,
    InitialRule,
    Password,
    Validator,
    ErrorBag,
    make,
    setDefaultLang,
    setFallbackLang,
    setTranslationObject,
};

export * from './rules/registerRule';
export * from './rule';



