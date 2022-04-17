import { ReplaceAttribueInterface } from '../types';
import { toDate } from '../utils/date';
import { getSize } from '../utils/general';
import { deepFind } from '../utils/object';

const replaceAttributes: ReplaceAttribueInterface = {

    /**
     * Replace all place-holders for the after rule.
     */
    replaceAfter: function (message: string, parameters: string[]): string {
        return this.replaceBefore(message, parameters);
    },

    /**
     * Replace all place-holders for the after_or_equal rule.
     */
    replaceAfterOrEqual: function (message: string, parameters: string[]): string {
        return this.replaceBefore(message, parameters);
    },

    /**
     *  Replace all place-holders for the before rule.
     */
    replaceBefore: function (message: string, paramaters: string[]): string {

        if (!toDate(paramaters[0])) {
            return message.replace(':date', paramaters[0].replace('_', ' '));
        }

        return message.replace(':date', paramaters[0]);
    },

    /**
     * Replace all place-holders for the before_or_equal rule.
     */
    replaceBeforeOrEqual: function (message: string, parameters: string[]): string {
        return this.replaceBefore(message, parameters);
    },

    /**
     * Replace all the place-holders for the between rule.
     */
    replaceBetween: function (message: string, parameters: string[]): string {
        const values = {':min': parameters[0], ':max': parameters[1]};
        return message.replace(/:min|:max/gi, matched => values[matched]);
    },

    /**
     * Replace all place-holders for the before_or_equal rule.
     */
    replaceDateEquals: function (message: string, parameters: string[]): string {
        return this.replaceBefore(message, parameters);
    },

    /**
     * Replace all place-holders for the digits rule. 
     */
    replaceDigits: function(message: string, parameters: string[]): string {
        return message.replace(':digits', parameters[0]);
    },

    /**
     * Replace all place-holders for the digits (between) rule.
     */
    replaceDigitsBetween: function(message: string, parameters: string[]): string {
        return this.replaceBetween(message, parameters);
    },

    /**
     * Replace all place-holders for the ends_with rule.
     */
    replaceEndsWith: function(message: string, parameters: string[]): string {
        return message.replace(':values', parameters.join(', '));
    },

    /**
     * Replace all place-holders for the starts_with rule.
     */
    replaceStartsWith: function(message: string, parameters: string[]): string {
        return message.replace(':values', parameters.join(', '));
    },

    /**
     * Replace all place-holders for the min rule.
     */
    replaceMin: function (message: string, parameters: string[]): string {
        return message.replace(':min', parameters[0]);
    },

    /**
     * Replace all place-holders for the max rule.
     */
    replaceMax: function (message: string, parameters: string[]): string {
        return message.replace(':max', parameters[0]);
    },

    /**
     * Replace all place-holders for the required_with rule.
     */
    replaceRequiredWith: function (message: string, parameters: string[]): string {
        return message.replace(':values', parameters.join(', '));
    },

    /**
     * Replace all place-holders for the required_with_all rule.
     */
    replaceRequiredWithAll: function (message: string, parameters: string[]): string {
        return this.replaceRequiredWith(message, parameters);
    },

    /**
     * Replace all place-holders for the required_without rule.
     */
    replaceRequiredWithout: function (message: string, parameters: string[]): string {
        return this.replaceRequiredWith(message, parameters);
    },

    /**
     * Replace all place-holders for the required_without_all rule.
     */
    replaceRequiredWithoutAll: function (message: string, parameters: string[]): string {
        return this.replaceRequiredWith(message, parameters);
    },

    /**
     * Replace all place-holders for the gt rule.
     */
    replaceGt: function (message: string, parameters: string[], data: object, hasNumericRule: boolean): string {
        const [ value ] = parameters;
        const result = deepFind(data, value);

        if (typeof result === 'undefined') {
            return message.replace(':value', value);
        }

        return message.replace(':value', getSize(result, hasNumericRule).toString());
    },

    /**
     * Replace all place-holders for the lt rule.
     */
    replaceLt: function (message: string, parameters: string[], data: object, hasNumericRule: boolean): string {
        return this.replaceGt(message, parameters, data, hasNumericRule);
    },

    /**
    * Replace all place-holders for the gte rule.
    */
    replaceGte: function (message: string, parameters: string[], data: object, hasNumericRule: boolean): string {
        return this.replaceGt(message, parameters, data, hasNumericRule);
    },

    /**
     * Replace all place-holders for the lte rule.
     */
    replaceLte: function (message: string, parameters: string[], data: object, hasNumericRule: boolean): string {
        return this.replaceGt(message, parameters, data, hasNumericRule);
    },

    /**
     * Replace all place-holders for the required_if rule.
     */
    replaceRequiredIf: function (message: string, parameters: string[]): string {
        parameters[0] = parameters[0].replace('_', ' ');

        const values = { 
            ':other': parameters[0].replace('_', ' '),
            ':value': parameters[1]
        }
        
        return message.replace(/:other|:value/gi, matched => values[matched]);

    }
};

export default replaceAttributes;