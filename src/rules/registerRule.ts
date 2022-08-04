import { builValidationdMethodName } from '../utils/build';
import validateAttributes from '../validators/validateAttributes';
import replaceAttributes from '../validators/replaceAttributes';
import { addImplicitRule } from '../utils/general';
import replaceAttributePayload from '../payloads/replaceAttributePayload';


export function register(
    rule: string,
    validate: (value: any, parameters?: string[], attribute?: string) => boolean,
    replaceMessage?: (message: string, paramters: string[], data?: object, getDisplayableAttribute?: Function) => string,
): boolean {
    const method: string = builValidationdMethodName(rule);

    let validateAttribute = new validateAttributes();
    if (validateAttribute[`validate${method}`]) {
        return false;
    }

    validateAttributes.prototype[`validate${method}`] = validate;

    if (typeof replaceMessage === 'function') {
        replaceAttributes[`replace${method}`] = 
        ({message, parameters, data, getDisplayableAttribute}: replaceAttributePayload) => replaceMessage(message, parameters, data, getDisplayableAttribute);
    }

    return true;
};

export function registerImplicit(
    rule: string,
    validate: (value: any, parameters?: string[]|number[], attribute?: string) => boolean,
    replaceMessage?: (message: string, paramters: string[], data?: object, getDisplayableAttribute?: Function) => string,
): void {
    if (register(rule, validate, replaceMessage) === true) {
        addImplicitRule(rule);
    }
};


