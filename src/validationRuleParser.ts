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
    

    explodeExplicitRules: function(rules: string|string[]): string[] {
        if (typeof rules === 'string') {
            rules =  rules.split('|');
        }

        return rules;
    },

    parseStringRule: function(rule: string): [string, string[]] {

        let parameters: string[] = [];
        let parameter: string;

        if (rule.indexOf(':') !== -1) {
            [rule, parameter] = rule.split(':');

            parameters = this.parseParameters(rule, parameter);
        }

        return [rule, parameters];
    },

    parseParameters: function(rule: string, parameter: string): string[] {
        rule = rule.toLocaleLowerCase();

        if (['regex', 'not_regex', 'notregex'].indexOf(rule) !== -1) {
            return [parameter];
        }

        return parameter.split(',');
    }
}

export default validationRuleParser;