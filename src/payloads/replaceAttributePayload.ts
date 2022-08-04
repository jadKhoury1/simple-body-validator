'use strict';

class replaceAttributePayload {

    /**
     * Stores the data object
     */
    data: object;

    /**
     * The message in which attributes will be replaced
     */
    message: string;

    /**
     * Parameters that will be used to replace the attributes
     */
    parameters: string[];


    /**
     * Flag that identifies wether the numeric rule exists or not
     */
    hasNumericRule: boolean;

    /**
     * The function that will be used to format attributes
     */
    getDisplayableAttribute: Function;


    constructor(data: object, message: string, parameters: string[], hasNumericRule: boolean, getDisplayableAttribute: Function) {
        this.data = data;
        this.message = message;
        this.parameters = parameters;
        this.hasNumericRule = hasNumericRule;
        this.getDisplayableAttribute = getDisplayableAttribute;
    }

};

export default replaceAttributePayload;