import { builValidationdMethodName } from '../utils/build';
import AttributesValidate from '../validators/AttributesValidate';
import AttributesReplace from '../validators/AttributesReplace';
import { addImplicitRule } from '../utils/general';


export function register(
    rule: string,
    validate: (value: any, parameters?: string[], attribute?: string) => boolean,
    replaceMessage?: (message: string, paramters: string[], data?: object, hasNumericRule?: boolean) => string,
): boolean {
    const method: string = builValidationdMethodName(rule);

    let validateAttribute = new AttributesValidate();
    if (validateAttribute[`validate${method}`]) {
        return false;
    }

    AttributesValidate.prototype[`validate${method}`] = validate;

    if (typeof replaceMessage === 'function') {
        AttributesReplace[`replace${method}`] = replaceMessage;
    }

    return true;
};

export function registerImplicit(
    rule: string,
    validate: (value: any, parameters?: string[]|number[], attribute?: string) => boolean,
    replaceMessage?: (message: string, paramters: string[], data?: object, hasNumericRule?: boolean) => string,
): void {
    if (register(rule, validate, replaceMessage) === true) {
        addImplicitRule(rule);
    }
};


