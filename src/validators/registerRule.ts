import { builValidationdMethodName } from '../utils/build';
import ValidateAttributes from './validateAttributes';
import replaceAttributes from './replaceAttributes';
import { addImplicitRule } from '../utils/general';


export default {
    register: function(
        rule: string, 
        validate: (value: any, parameters?: string[], attribute?: string) => boolean,
        replaceMessage?: (message: string, paramters: string[], data?: object, hasNumericRule?: boolean) => string,
    ): boolean{
        const method = builValidationdMethodName(rule);

        let validateAttribute = new ValidateAttributes({}, {});
        if (validateAttribute[`validate${method}`]) {
            console.log('This was reached');
            return false;
        }

        ValidateAttributes.prototype[`validate${method}`] = validate;

        if (typeof replaceMessage === 'function') {
            replaceAttributes[`replace${method}`] = replaceMessage;
        }

        return true;
    },

    registerImplicit: function(
        rule: string, 
        validate: (value: any, parameters?: string[]|number[], attribute?: string) => boolean,
        replaceMessage?: (message: string, paramters: string[], data?: object, hasNumericRule?: boolean) => string,
    ): void {
        if (this.register(rule, validate, replaceMessage)) {
            addImplicitRule(rule);
        }
    },

};

