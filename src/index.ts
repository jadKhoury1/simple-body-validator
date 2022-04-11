import { CustomMesages, Rules } from './types';
import Validator from './validator';
import Lang from './lang';

export default  {
    make: function(data: object = {}, rules: Rules = {}, customMessages: CustomMesages = {}): Validator {
        return new Validator(data, rules, customMessages);
    },
    setDefaultLang: function(lang: string): void {
        Lang.setDefaultLang(lang);
    },
    setTranslationPath: function(path: string): void {
        Lang.setPath(path);
    },
};
