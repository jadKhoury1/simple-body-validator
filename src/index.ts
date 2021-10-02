'use strict';

import { Rules, Messages } from './types';
import validationRuleParser from './validationRuleParser';

class Validator {

    /**
     * The data object that will be validated
     */
    data: object;

    /**
     * The rules that will be used to check the validity of the data    
     */
    rules: Rules;

    /**
     * Custom mesages returrned based on the error 
     */
    messages: Messages;

    constructor(data: object, rules: Rules, messages: Messages) {
        this.data = data;
        this.messages = messages;
        this.rules = this.setRules(rules);
    };

    setRules(rules: Rules): Rules {
        return validationRuleParser.explodeRules(rules);
    }

}

export default Validator;