'use strict';

import BaseRule from './baseRule';

class NotIn extends BaseRule {

    /**
     * The name of the rule.
     */
    rule: string = 'not_in';

    /**
     * The accepted values.
     */
    values: (string|number)[] = [];

    /**
     * Create a new NotIn rule instance.
     */
    constructor(values: (string|number)[]) {
        super();
        this.values = values;
    }

    /**
     * Convert the rule to a validation string.
     */
    toString() {
        return `${this.rule}:${this.values.join(',')}`
    }
}

export default NotIn;