'use strict';


import Lang from '../lang';
import { deepFind } from '../utils/object';

export default class RuleContract {

    /**
     * The validation error message.
     */
    message: string|object = '';

    /**
     * All of the data under validation.
     */
    data: object = {};

    /**
     * The lang used to return error messages
     */
    lang: string;

    /**
     *  Determine if the validation rule passes.
     */
    passes(value: any, attribute: string): boolean {
        return true;
    };

    /**
     * Get the validation error message.
     */
    getMessage(): string|object {
        return this.message;
    };

    /**
     * Set the data under validation.
     */
    setData(data: object): RuleContract {
        this.data = data;
        return this;
    };

    /**
     * Set the tranlation language
     */
    setLang(lang: string): RuleContract {
        this.lang = lang;
        return this;
    };

    /**
     * Get the translated error message based on the specified path
     */
    trans(path: string, params: object = {}): string {

        const validatonMessages = Lang.get(this.lang);
        let message: string = deepFind(validatonMessages, path) || '';

        if (! message ) {
            return message;
        }

        for (let key in params) {
            message = message.replace(`:${key}`, params[key]);
        }

        return message;
    }

}