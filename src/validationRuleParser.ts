'use strict';

import { Rules, ValidationRuleParserInterface } from "./types";


const validationRuleParser: ValidationRuleParserInterface =  {
    
    explodeRules: function name(rules: Rules): Rules {
        for (const key in rules) {
            if (rules.hasOwnProperty(key)) {
                rules[key] = this.explodeExplicitRules(rules[key]);
            }
        }

        return rules;  
    },
    

    explodeExplicitRules: function(rule: string|string[]): string[] {
        if (typeof rule === 'string') {
            return rule.split('|');
        }

        return rule;
    },

    parseStringRule: function(rule: string): [string, string[]] {

        let parameters: string[] = [];
        let parameter: string;

        if (rule.includes(':') === true) {
            [rule, parameter] = rule.split(':');

            parameters = this.parseParameters(rule, parameter);
        }

        return [rule, parameters];
    },

    parseParameters: function(rule: string, parameter: string): string[] {
        rule = rule.toLocaleLowerCase();

        if (['regex', 'not_regex', 'notregex'].includes(rule)) {
            return [parameter];
        }

        return parameter.split(',');
    }
}

export default validationRuleParser;