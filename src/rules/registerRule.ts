import { builValidationdMethodName } from '../utils/build';
import validateAttributes from '../validators/validateAttributes';
import replaceAttributes from '../validators/replaceAttributes';
import { addImplicitRule } from '../utils/general';


export function register(
    rule: string,
    validate: (value: any, parameters?: string[], attribute?: string) => boolean,
    replaceMessage?: (message: string, paramters: string[], data?: object, hasNumericRule?: boolean) => string,
): boolean {
    const method: string = builValidationdMethodName(rule);

    let validateAttribute = new validateAttributes();
    if (validateAttribute[`validate${method}`]) {
        return false;
    }

    validateAttributes.prototype[`validate${method}`] = validate;

    if (typeof replaceMessage === 'function') {
        replaceAttributes[`replace${method}`] = replaceMessage;
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


