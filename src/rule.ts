'use strict';

import RequiredIf from './rules/requiredIf';

export function requiredIf(callback: boolean|CallableFunction) {
    return new RequiredIf(callback);
}