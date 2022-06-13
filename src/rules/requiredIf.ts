'use strict';

import BaseRule from './baseRule';

class RequiredIf extends BaseRule {

    /**
     * The condition that validates the attribute
     */
    condition: boolean|CallableFunction;


    /**
     * Create a new required validation rule based on a condition.
     */
    constructor(condition: boolean|CallableFunction) {
        super();
        this.condition = condition;
    }

    /**
     * Convert the rule to a validation string.
     */
    toString(): string {
        if (typeof this.condition === 'function') {
            return this.condition() ? 'required' : '';
        }

        return this.condition ? 'required' : '';
    }
    
}

export default RequiredIf;