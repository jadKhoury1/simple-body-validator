'use strict';

import RuleContract from './ruleContract';

class Regex extends RuleContract {

    /**
     * The Regular expression to validate 
     */
    regex: RegExp;

    /**
     * Flag that decides whether the value should match the regular expression or not
     */
    shouldMatch: boolean;

    constructor(regex: RegExp, shouldMatch: boolean = true) {
        super();
        this.regex = regex;
        this.shouldMatch = shouldMatch;
    }

    passes(value: any): boolean {
        if (this.shouldMatch) {
            return this.regex.test(value);
        }

        return ! this.regex.test(value);
    }

    getMessage(): string {
        if (this.shouldMatch) {
            return this.trans('regex');
        }

        return this.trans('not_regex');
    }

}

export default Regex;