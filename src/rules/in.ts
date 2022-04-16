import BaseRule from './baseRule';

class In extends BaseRule {

    /**
     * The name of the rule.
     */
    rule: string = 'in';

    /**
     * The accepted values.
     */
    values: (string|number)[] = [];

    /**
     * Create a new In rule instance.
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

export default In;