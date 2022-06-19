'use strict';

import { LangInterface } from './types';
import { mergeDeep } from './utils/object';
import locales from './locales';

const lang: LangInterface = {

    /**
     * Default lang to be used, when lang is not specified 
     */
    defaultLang: 'en',

    /**
     * The existing langs that are supported by the library
     */
    existingLangs: ['en'],

    /**
     * Stores the messages that are already loaded
     */
    messages: {},

    /**
     * Stores the default messages
     */
    defaultMessages: require('./locales/en.js').default,

    /**
     * Path of the validation translations in the main project
     */
    path: '',



    /**
     * Get messages for lang 
     */
    get(lang: string = this.defaultLang): object {
        this.load(lang);
        return this.messages[lang];
    },

    /**
     * Set the path for the validation translations in the main project
     */
    setPath(path: string): void {
        this.path = path;
        this.setDefaultLang(this.defaultLang);
    },

    /**
     * Set the default lang that should be used. And assign the default messages
     */
    setDefaultLang(lang: string): void {

        this.defaultLang = lang;

        // check if the lang translations exist in the library and load them
        if (locales.hasOwnProperty(lang)) {
            this.defaultMessages = mergeDeep(this.defaultMessages, locales[lang]);
        }

        // Get the translations from the path specified by the user 
        if (this.path) {
            try {
                let customMessages = require(`${this.path}/${lang}.js`);
                customMessages = customMessages.default || customMessages;
                this.defaultMessages = mergeDeep(this.defaultMessages, customMessages); 
            } catch (e) {};
        }
    },

    /**
     * Get the default language
     */
    getDefaultLang(): string {
        return this.defaultLang;
    },

    /**
     * Load the messages based on the specified language
     */
    load(lang: string): void {

        if (this.messages[lang]) {
            return;
        }

        // check if the lang translations exist in the library and load them
        if (locales.hasOwnProperty(lang)) {
            this.messages[lang] = mergeDeep(this.defaultMessages, locales[lang]);
        } else {
            this.messages[lang] = mergeDeep({}, this.defaultMessages);
        }

          // check if the lang file exists in the project directory and merge the messages
       if (this.path) {
            try {
                let customMessages = require(`${this.path}/${lang}.js`);
                customMessages = customMessages.default || customMessages;
                this.messages[lang] = mergeDeep(this.messages[lang], customMessages);
            } catch (e) {};
        }
    }
};

export default lang;