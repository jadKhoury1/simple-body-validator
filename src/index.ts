import { CustomMesages, Rules } from './types';
import Validator from './validator';
import Lang from './lang';
import registerRule from './validators/registerRule';

export default  {
    make: function(data: object = {}, rules: Rules = {}, customMessages: CustomMesages = {}, lang: string =  Lang.getDefaultLang()): Validator {
        return new Validator(data, rules, customMessages, lang);
    },
    setDefaultLang: function(lang: string): void {
        Lang.setDefaultLang(lang);
    },
    setTranslationPath: function(path: string): void {
        Lang.setPath(path);
    },
    ... registerRule
};
