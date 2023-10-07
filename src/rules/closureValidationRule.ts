'use strict';

import { ValidationCallback } from '../types';
import RuleContract  from './ruleContract';

class ClosureValidationRule extends RuleContract {

    /**
     * The callback that validates the attribute
     */
    callback: Function|ValidationCallback;

    /**
     * Indicates if the validation callback failed.
     */
    failed: boolean = false;

    constructor(callback: Function|ValidationCallback) {
        super();
        this.callback = callback;
    }

    /**
     * Determine if the validation rule passes.
     */
    passes(value: any, attribute: string): boolean|Promise<boolean> {
        this.failed = false;
        const result = this.callback(value, function(message) {
            this.failed = true;
            this.message = message;
        }.bind(this), attribute);

        if (result instanceof Promise) {
            return result.then(() => !this.failed);
        }

        return !this.failed;
    };

}

export default ClosureValidationRule;