'use strict';

import { Rules, ValidationRuleParserInterface } from '../types';
import validationData from './validationData';


const validationRuleParser: ValidationRuleParserInterface =  {
    
    /**
     * Convert rules to array
     */
    explodeRules: function(rules: Rules, data: object = {}): Rules {
        for (const key in rules) {
            if (key.indexOf('*') !== -1) {
                rules = this.explodeWildCardRules(rules, key, data);    
                
                delete rules[key];
            }
            else if (rules.hasOwnProperty(key)) {
                rules[key] = this.explodeExplicitRules(rules[key]);
            }
        }

        return rules;  
    },

    /**
     * Define a set of rules that apply to each element in an array attribute.
     */
    explodeWildCardRules: function(results: object, attribute: string, masterData: object): object {
        const pattern: RegExp = new RegExp('^' + attribute.replace('*', '[^.]*') + '\z');
        const data: object = validationData.initializeAndGatherData(attribute, masterData);
        const rule: string = results[attribute];

        for (let key in data) {
            if (key.match(new RegExp(`^${attribute}`)) !== null || key.match(pattern) !== null) {
                results = this.mergeRulesForAttribute(results, key, rule);  
            } 
        }

        return results;
    },

    /**
     * Merge additional rules into a given attribute.
     */
    mergeRulesForAttribute(results: object, attribute: string, rules: string|string[]): object {
        const merge = this.explodeRules([rules])[0];

        results[attribute] = [ ...results[attribute] ? this.explodeExplicitRules(results[attribute]) : [], ...merge ];

        return results;
    },

    /**
     * In case the rules specified by the user are a string seperated with '|' - convert them to an array
     */
    explodeExplicitRules: function(rules: string|string[]): string[] {
        if (typeof rules === 'string') {
            rules =  rules.split('|');
        }

        return rules;
    },

    /**
     * Parse the parameters associated with a rule
     */
    parseStringRule: function(rule: string): [string, string[]] {

        let parameters: string[] = [];
        let parameter: string;

        if (rule.indexOf(':') !== -1) {
            [rule, parameter] = rule.split(/:(.+)/);

            parameters = this.parseParameters(rule, parameter);
        }

        return [rule, parameters];
    },

    /**
     * Parase marameters based on rule name
     */
    parseParameters: function(rule: string, parameter: string): string[] {
        rule = rule.toLocaleLowerCase();

        if (['regex', 'not_regex', 'notregex'].indexOf(rule) !== -1) {
            return [parameter];
        }

        return parameter.split(',');
    },

    /**
     * Get a rule and its parameters for a given attribute.
     */
    getRule: function (attribute: string, searchRules: string|string[], availableRules: Rules): Partial<[string, string[]]> {

        // The available rules are all the rules specified by the uer for example - 
        // { name: ['requied', 'string'], age: ['required', 'gt:10']}
        // A valid attribute in that case would be age
        if (!availableRules[attribute]) {
            return [];
        }

        // The search rule can be either a string or an array - lets say we want check if the 'gt' rule exists for 
        // the age attrtibute - in that case the serachRules will be equal to 'gt' - In case an array is used
        // the method will return the data for the first matched rule
        searchRules = Array.isArray(searchRules) ? searchRules : [ searchRules ];

        for (let i = 0; i < availableRules[attribute].length; i++) {
            let [ rule, parameters ] = this.parseStringRule(availableRules[attribute][i]);

            if (searchRules.indexOf(rule) !== -1) {
                // return the rule and parameters for the first match
                return [ rule, parameters ];
            }
        }

        return [];
    },

    /**
     * Determine if the given attribute has a rule in the given set of available rules.
     */
    hasRule: function (attribute: string, searchRules: string|string[], availableRules: Rules): boolean {
        return this.getRule(attribute, searchRules, availableRules).length > 0;
    },
};


export default validationRuleParser;