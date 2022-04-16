'use strict';

import RequiredIf from './rules/requiredIf';
import In from './rules/in';
import NotIn from './rules/notIn';

export function requiredIf(callback: boolean|CallableFunction): RequiredIf {
    return new RequiredIf(callback);
};

export function ruleIn (values: (string|number)[]): In {
    return new In(values);
}

export function ruleNotIn (values: (string|number)[]): NotIn {
    return new NotIn(values);
}