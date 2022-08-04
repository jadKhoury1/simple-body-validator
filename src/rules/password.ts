'use strict';

import { InitialRule } from '../types';
import Validator from '../validator';
import RuleContract from './ruleContract';

class Password extends RuleContract {


    /**
     * The validator performing the validation.
     */
    private validator: Validator;
 
    /**
     * The minimum size of the password.
     */
    private minLength: number = 8;

    /**
     * The min amount of lower case letters required in the password 
     */
    private minLowerCase: number = 0;

    /**
     * The min amount of uppercase letters required in the password
     */
    private minUpperCase: number = 0;

    /**
     * The min amount of letters required in the password
     */
    private minLetters: number = 0;

    /**
     * The min amount of letters required in the password
     */
    private minNumbers: number = 0;

    /**
     * The min amount of symbols required in the password
     */
    private minSymbols: number = 0;


    /**
     * Additional validation rules that should be merged into the default rules during validation.
     */
    private customRules: InitialRule[] = [];


    /**
     * The callback that will generate the "default" version of the password rule.
     */
    static defaultCallback: Function|Password;

    /**
     * Create a new instance of the password class
     */
    static create(): Password {
        return new Password();
    }


    /**
     * Set the minimum length of the password
     */
    min(min: number): Password {
        this.minLength = min;
        return this;
    }

    /**
     * Set the min amount of letters required in the password
     */
    letters(letters: number = 1): Password {
        this.minLetters = letters;
        return this;
    }

    /**
     * Set the min amount of upper and lower case letters required in the password
     */
    mixedCase(upperCase: number = 1, lowerCase: number = 1): Password {
        this.minUpperCase = upperCase;
        this.minLowerCase = lowerCase;
        return this;
    }

    /**
     * Set the min amount of numbers required in the password
     */
    numbers(numbers: number = 1): Password {
        this.minNumbers = numbers;
        return this;
    };

    /**
     * Set the min amount of symbols required in the password
     */
    symbols(symbols: number = 1): Password {
        this.minSymbols = symbols;
        return this;
    }

    /**
     * Determine if the validation rule passes.
     */
    passes(value: any, attribute: string): boolean {

        const validator: Validator = new Validator(this.data, {
            [attribute]: ['string', `min:${this.minLength}`, ... this.customRules]
        }, this.validator.customMessages, this.validator.customAttributes).setLang(this.lang);

        if (!validator.validate()) {
            const errors: object = validator.errors().addErrorTypes().get(attribute);

            for(let key in errors) {
                this.validator.errors().add(attribute, errors[key]);
            }
        }

        if (typeof value !== 'string') {
            value = '';
        }

        let pattern;
        const formattedAttribute = this.validator.getDisplayableAttribute(attribute);

        if (this.minLowerCase) {
             pattern = this.minLowerCase === 1 ? /\p{Ll}/u : new RegExp(`(.*\\p{Ll}){${this.minLowerCase}}.*`, 'u');
            if (!value || pattern.test(value) === false) {
                this.validator.errors().add(attribute, { 
                    error_type: 'min_lower_case',
                    message: this.trans(`password.${this.minLowerCase === 1 ? 'lower_case' : 'lower_cases'}`, { 
                        attribute: formattedAttribute, amount: this.minLowerCase 
                    }) 
                });
            }
        }

        if (this.minUpperCase) {
            pattern = this.minUpperCase === 1 ? /\p{Lu}/u : new RegExp(`(.*\\p{Lu}){${this.minUpperCase}}.*`, 'u');
            if (!value || pattern.test(value) === false) {
                this.validator.errors().add(attribute, {
                    error_type: 'min_upper_case',
                    message: this.trans(`password.${this.minUpperCase === 1 ? 'upper_case' : 'upper_cases'}`, { 
                        attribute: formattedAttribute, amount: this.minUpperCase 
                    }) 
                })
            }
        }

        if (this.minLetters) {
            pattern = this.minLetters === 1 ? /\p{L}/u : new RegExp(`(.*\\p{L}){${this.minLetters}}.*`, 'u');
            if (!value || pattern.test(value) === false) {
                this.validator.errors().add(attribute, {
                    error_type: 'min_letters',
                    message: this.trans(`password.${this.minLetters === 1 ? 'letter' : 'letters'}`, { 
                        attribute: formattedAttribute, amount: this.minLetters 
                    }) 
                })
            }
        }

        if (this.minNumbers) {
            pattern = this.minNumbers === 1 ? /\p{N}/u : new RegExp(`(.*\\p{N}){${this.minNumbers}}.*`, 'u');
            if (!value || pattern.test(value) === false) {
                this.validator.errors().add(attribute, {
                    error_type: 'min_numbers',
                    message: this.trans(`password.${this.minNumbers === 1 ? 'number' : 'numbers'}`, { 
                        attribute: formattedAttribute,   amount: this.minNumbers 
                    }) 
                })
            }
        }

        if (this.minSymbols) {
            pattern = this.minSymbols === 1 ? /\p{Z}|\p{S}|\p{P}/u : new RegExp(`(.*(\\p{Z}|\\p{S}|\\p{P})){${this.minSymbols}}.*`, 'u');
            if (!value || pattern.test(value) === false) {
                this.validator.errors().add(attribute, {
                    error_type: 'min_symbols',
                    message: this.trans(`password.${this.minSymbols === 1 ? 'symbol' : 'symbols'}`, { 
                        attribute: formattedAttribute, amount: this.minSymbols 
                    }) 
                })
            }
        }

        if (this.validator.errors().has(attribute)) {
            return false
        }

        return true;
    }


    /**
     * Specify additional validation rules that should be merged with the default rules during validation.
     */
    rules(rules: InitialRule[]): Password {
        this.customRules = rules;
        return this;
    }

    /**
     * Get all the validation error messages related to the password
     */
    getMessage(): object {
        return {};
    }

    /**
     * Set the validator instance used to validate the password
     */
    setValidator(validator: Validator): Password {
        this.validator = validator;
        return this;
    }

    /**
     * Set the default callback to be used for determining a password's default rules.
     */
    static setDefault(callback: Function|Password = null): void {

        if (callback instanceof Password) {
            this.defaultCallback = callback;
            return;
        }
    
        if (typeof callback !== 'function') {
            throw 'The given callback should be callable';
        }

        this.defaultCallback = callback;
    }

    /**
     * Get the default configuration of the password rule.
     */
    static default(): RuleContract|Password {
        const password = typeof this.defaultCallback === 'function' ? this.defaultCallback() : this.defaultCallback;

        return password instanceof RuleContract ? password : Password.create().min(8);
    }

};

export default Password;

