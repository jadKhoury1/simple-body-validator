import { CustomMesages, Rules } from './types';
import Validator from './validator';
import Lang from './lang';
import RuleContract from './ruleContract';


export class Rule extends RuleContract {};

export * from './rules/registerRule';

export function make(data: object = {}, rules: Rules = {}, customMessages: CustomMesages = {}, lang: string =  Lang.getDefaultLang()): Validator {
    return new Validator(data, rules, customMessages, lang);
};

export function setDefaultLang(lang: string): void {
    Lang.setDefaultLang(lang);
};

export function setTranslationPath(path: string): void {
    Lang.setPath(path);
};

