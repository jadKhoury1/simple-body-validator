import replaceAttributePayload from '../payloads/replaceAttributePayload';
import { ReplaceAttribueInterface } from '../types';
import { toDate } from '../utils/date';;
import { getSize } from '../utils/general';
import { deepFind } from '../utils/object';

const replaceAttributes: ReplaceAttribueInterface = {


    /**
     * Replace all place-holders for the accepted_if rule.
     */
    replaceAcceptedIf: function ({ data, message, parameters, getDisplayableAttribute }: replaceAttributePayload): string {
        const [ other ] = parameters;
        const result = deepFind(data, other);

        const values = {
            ':other': getDisplayableAttribute(other),
            ':value': result
        }

        return message.replace(/:other|:value/gi, matched => values[matched]);

    },

    /**
     * Replace all place-holders for the after rule.
     */
    replaceAfter: function (payload: replaceAttributePayload): string {
        return this.replaceBefore(payload);
    },

    /**
     * Replace all place-holders for the after_or_equal rule.
     */
    replaceAfterOrEqual: function (payload: replaceAttributePayload): string {
        return this.replaceBefore(payload);
    },

    /**
     *  Replace all place-holders for the before rule.
     */
    replaceBefore: function ({ message, parameters, getDisplayableAttribute }: replaceAttributePayload): string {

        if (!toDate(parameters[0])) {
            return message.replace(':date', getDisplayableAttribute(parameters[0]));
        }

        return message.replace(':date', parameters[0]);
    },

    /**
     * Replace all place-holders for the before_or_equal rule.
     */
    replaceBeforeOrEqual: function (payload: replaceAttributePayload): string {
        return this.replaceBefore(payload);
    },

    /**
     * Replace all the place-holders for the between rule.
     */
    replaceBetween: function ({ message, parameters }: replaceAttributePayload): string {
        const values = {':min': parameters[0], ':max': parameters[1]};
        return message.replace(/:min|:max/gi, matched => values[matched]);
    },

    /**
     * Replace all place-holders for the before_or_equal rule.
     */
    replaceDateEquals: function (payload: replaceAttributePayload): string {
        return this.replaceBefore(payload);
    },

    /**
     *  Replace all place-holders for the declined_if rule.
     */
    replaceDeclinedIf: function ({ message, parameters, data, getDisplayableAttribute }: replaceAttributePayload): string {
        const [ other ] = parameters;
        const result = deepFind(data, other);

        const values = {
            ':other': getDisplayableAttribute(other),
            ':value': result
        }

        return message.replace(/:other|:value/gi, matched => values[matched]);

    },

    /**
     * Replace all place-holders for the different rule.
     */
    replaceDifferent: function(payload: replaceAttributePayload): string {
        return this.replaceSame(payload);
    },

    /**
     * Replace all place-holders for the digits rule.
     */
    replaceDigits: function({ message, parameters }: replaceAttributePayload): string {
        return message.replace(':digits', parameters[0]);
    },

    /**
     * Replace all place-holders for the digits (between) rule.
     */
    replaceDigitsBetween: function(payload: replaceAttributePayload): string {
        return this.replaceBetween(payload);
    },

    /**
     * Replace all place-holders for the ends_with rule.
     */
    replaceEndsWith: function({ message, parameters }: replaceAttributePayload): string {
        return message.replace(':values', parameters.join(', '));
    },

    /**
     * Replace all place-holders for the starts_with rule.
     */
    replaceStartsWith: function({ message, parameters }: replaceAttributePayload): string {
        return message.replace(':values', parameters.join(', '));
    },

    /**
     * Replace all place-holders for the min rule.
     */
    replaceMin: function ({ message, parameters }: replaceAttributePayload): string {
        return message.replace(':min', parameters[0]);
    },

    /**
     * Replace all place-holders for the max rule.
     */
    replaceMax: function ({ message, parameters }: replaceAttributePayload): string {
        return message.replace(':max', parameters[0]);
    },

    /**
     * Replace all place-holders for the required_with rule.
     */
    replaceRequiredWith: function ({ message, parameters, getDisplayableAttribute }: replaceAttributePayload): string {
        return message.replace(':values', parameters.map(attribute => getDisplayableAttribute(attribute)).join(', '));
    },

    /**
     * Replace all place-holders for the required_with_all rule.
     */
    replaceRequiredWithAll: function (payload: replaceAttributePayload): string {
        return this.replaceRequiredWith(payload);
    },

    /**
     * Replace all place-holders for the required_without rule.
     */
    replaceRequiredWithout: function (payload: replaceAttributePayload): string {
        return this.replaceRequiredWith(payload);
    },

    /**
     * Replace all place-holders for the required_without_all rule.
     */
    replaceRequiredWithoutAll: function (payload: replaceAttributePayload): string {
        return this.replaceRequiredWith(payload);
    },

    /**
     * Replace all place-holders for the gt rule.
     */
    replaceGt: function ({ message, parameters, data, hasNumericRule }: replaceAttributePayload): string {
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
    replaceLt: function (payload: replaceAttributePayload): string {
        return this.replaceGt(payload);
    },

    /**
    * Replace all place-holders for the gte rule.
    */
    replaceGte: function (payload: replaceAttributePayload): string {
        return this.replaceGt(payload);
    },

    /**
     * Replace all place-holders for the lte rule.
     */
    replaceLte: function (payload: replaceAttributePayload): string {
        return this.replaceGt(payload);
    },

    /**
     * Replace all place-holders for the required_if rule.
     */
    replaceRequiredIf: function ({ message, parameters, data, getDisplayableAttribute }: replaceAttributePayload): string {
        const [ other ] = parameters;
        const result = deepFind(data, other);

        const values = {
            ':other': getDisplayableAttribute(other),
            ':value': result
        }

        return message.replace(/:other|:value/gi, matched => values[matched]);

    },

    /**
     * Replace all the place-holders for the required_unless rule.
     */
    replaceRequiredUnless: function({ message, parameters, getDisplayableAttribute }: replaceAttributePayload): string {
        const [other] = parameters;

        const values = {
            ':other': getDisplayableAttribute(other),
            ':values': parameters.slice(1).join(', ')
        };

        return message.replace(/:other|:values/gi, matched => values[matched]);
    },

    /**
     * Replace all place-holders for the same rule.
     */
    replaceSame: function ({ message, parameters, getDisplayableAttribute }: replaceAttributePayload): string {
        return message.replace(':other', getDisplayableAttribute(parameters[0]));
    },

    /**
     * Replace all place-holders for the size rule.
     */
    replaceSize: function ({ message, parameters }: replaceAttributePayload): string {
        return message.replace(':size', parameters[0]);
    },
};

export default replaceAttributes;
