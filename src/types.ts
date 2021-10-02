'use strict';

export interface Rules {
    [key: string]: string|string[]
};

export interface Messages {
    [key: string]: string
};

export interface ValidationRuleParserInterface {
    explodeRules: (rules: Rules) => Rules;

    explodeExplicitRules(rule: string|string[]): string[];
}