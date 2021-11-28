import { ReplaceAttribueInterface } from "../types";
import { getSize } from "../utils/general";

const replaceAttributes: ReplaceAttribueInterface = {

    /**
     * Replace all the place-holders for the between rule.
     */
    replaceBetween: function (message: string, parameters: string[]): string {
        const values = {':min': parameters[0], ':max': parameters[1]};
        return message.replace(/:min|:max/gi, matched => values[matched]);
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
    replaceGt: function (message: string, parameters: string[], data: object): string {
        const [ value ] = parameters;

        if (typeof data[value] === 'undefined') {
            return message.replace(':value', parameters[0]);
        }

        return message.replace(':value', getSize(value).toString());
    },

    /**
     * Replace all place-holders for the lt rule.
     */
    replaceLt: function (message: string, parameters: string[], data: object): string {
        return this.replaceGt(message, parameters, data);
    },

    /**
    * Replace all place-holders for the gte rule.
    */
    replaceGte: function (message: string, parameters: string[], data: object): string {
        return this.replaceGt(message, parameters, data);
    },

    /**
     * Replace all place-holders for the lte rule.
     */
    replaceLte: function (message: string, parameters: string[], data: object): string {
        return this.replaceGt(message, parameters, data);
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