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
    }
}

export default validationRuleParser;