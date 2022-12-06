'use strict';

import { ErrorMessage, Errors, Messages } from '../types';


class ErrorBag {

    /**
     * All of the registered messages.
     */
    errors: Errors = {};

    /**
     * All Messages
     */
    messages: Messages = {};

    /**
     * Stores the first error message
     */
    firstMessage: string = '';

    /**
     * Specify whether error types should be returned or no
     */
    withErrorTypes: boolean = false;


    constructor(errors: Errors = {}, messages: Messages = {}, firstMessage: string = '', withErrorTypes: boolean = false) {
        this.errors = errors;
        this.messages = messages;
        this.firstMessage = firstMessage;
        this.withErrorTypes = withErrorTypes;
    }


    /**
     * Set withErrorTypes attribute to true
     */
    addErrorTypes(): ErrorBag {
        this.withErrorTypes = true;
        return this;
    }

    /**
     * Add new recodrs to the errors and messages objects
     */
    add(key: string, error: ErrorMessage): void {
        if (Array.isArray(this.errors[key]) && Array.isArray(this.messages[key])) {
            this.errors[key].push(error);
            this.messages[key].push(error.message);
        } else {
            this.errors[key] = [error];
            this.messages[key] = [error.message];
        }

        this.firstMessage = this.firstMessage || error.message;
    };

    /**
     * Get the first error related to a specific key
     */
    first(key: string = null): string {

        if (!key) {
            return this.firstMessage;
        }

        if (this.has(key)) {
            return this.messages[key][0];
        }

        return '';
    };

    /**
     * Get the error messages keys
     */
    keys(): string[] {
        return Object.keys(this.messages);
    };

    /**
     * Get all the messages related to a specific key
     */
    get(key: string, withErrorTypes: boolean = this.withErrorTypes): ErrorMessage[]|string[] {

        if (! this.has(key)) {
            return [];
        }

        if (withErrorTypes) {
            return this.errors[key];
        }

        return this.messages[key];
    };

    /**
     * Check if key exists in messages
     */
    has(key: string): boolean {
        return this.messages[key] && this.messages[key].length > 0 ? true : false;
    };

    /**
     * Get all error messages
     */
    all(allMessages: boolean = true, withErrorTypes = this.withErrorTypes): object {
        let messages: object = withErrorTypes ? { ... this.errors } : { ... this.messages };
        
        if (! allMessages) {
            Object.keys(messages).map(attribute => messages[attribute] = messages[attribute][0]);
        }

        return messages;
    };

    /**
     * Remove error message using the key name
     */
    forget(key: string): void {
        if (this.messages.hasOwnProperty(key)) {
            delete this.messages[key];
            delete this.errors[key];
            this.firstMessage = '';
            
            if (this.keys().length > 0) {
                this.firstMessage = this.messages[Object.keys(this.messages)[0]][0];
            }
        }
    };

    /**
     * Remove all error messages that start with the given path
     */
    forgetAll(path: string): void {
        const keys: string[] = Object.keys(this.messages).filter(key => key.startsWith(path));

        if (keys.length > 0 ) {
            keys.forEach((key: string) => {
                this.forget(key);
            });
        }
    };

    /**
     * Clone ErrorBag Instance
     */
    clone(): ErrorBag {
        return new ErrorBag({...this.errors}, {...this.messages}, this.firstMessage, this.withErrorTypes);
    }
}

export default ErrorBag;