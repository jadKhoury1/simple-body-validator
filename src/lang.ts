'use strict';

import { LangInterface } from './types';
import { mergeDeep } from './utils/object';
import locales from './locales/index';

const lang: LangInterface = {

    /**
     * Default lang to be used, when lang is not specified 
     */
    defaultLang: 'en',

    /**
     * Determines the locale to be used when tu current one is not available
     */
    fallbackLang: 'en',

    /**
     * The existing langs that are supported by the library
     */
    existingLangs: ['en'],

    /**
     * Store the translations passed by the user
     */
    translations: {},

    /**
     * Stores the messages that are already loaded
     */
    messages: {},

    /**
     * Stores the default messages
     */
    defaultMessages: {},

    /**
     * Stores the fallback messages
     */
    fallbackMessages: require('./locales/en.js').default,

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
     * Set the translation object passed by the user
     */
    setTranslationObject(translations: object): void {
        this.translations = translations;
        this.setDefaultLang(this.defaultLang);
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
       this.load(lang);
    },

    /**
     * Set the fallback lang to be used. And assign the fallback messages
     */
    setFallbackLang(lang: string): void {
        this.fallbackLang = lang;
        this.fallbackMessages = require('./locales/en.js').default;

        // check if the lang translations exist in the library and load them
        if (locales.hasOwnProperty(lang)) {
            this.fallbackMessages = mergeDeep(this.fallbackMessages, locales[lang]);
        }

        // Get the translations from the path specified by the user 
        if (this.path) {
            try {
                let customMessages = require(this.path + '/' + lang + '.js');
                customMessages = customMessages.default || customMessages;
                this.fallbackMessages = mergeDeep(this.fallbackMessages, customMessages); 
            } catch (e) {};
        }

        // check if the lang translations exit in the object passed by the user
        if (this.translations.hasOwnProperty(lang)) {
            this.fallbackMessages = mergeDeep(this.fallbackMessages, this.translations[lang]);
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
            this.messages[lang] = mergeDeep(this.fallbackMessages, locales[lang]);
        } else {
            this.messages[lang] = mergeDeep({}, this.fallbackMessages);
        }

          // check if the lang file exists in the project directory and merge the messages
       if (this.path) {
            try {
                let customMessages = require(this.path + '/' + lang + '.js');
                customMessages = customMessages.default || customMessages;
                this.messages[lang] = mergeDeep(this.messages[lang], customMessages);
            } catch (e) {};
        }

         // check if the lang translations exist in the object passed by the user
         if (this.translations.hasOwnProperty(lang)) {
            this.messages[lang] = mergeDeep(this.messages[lang], this.translations[lang]);
        }
    }
};

export default lang;