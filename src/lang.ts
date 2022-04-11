'use strict';

import { existsSync } from 'fs';
import { LangInterface } from './types';
import { mergeDeep } from './utils/object';

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
    defaultMessages: require('./locales/en').default,

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

        if (this.existingLangs.indexOf(lang) !== -1) {
            this.defaultMessages= { ... require(`./locales/${lang}`).default };
        }

        if (this.path && existsSync(`${this.path}/${lang}.js`)) {
            let customMessages = require(`${this.path}/${lang}.js`);
            customMessages = customMessages.default || customMessages;  
            this.defaultMessages = mergeDeep(this.defaultMessages, customMessages);
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

        // check if the lang already exists in the librarry and assign it the message object
        if (this.existingLangs.indexOf(lang) !== -1) {
            this.messages[lang] = { ... require(`./locales/${lang}`).default };
        } else {
            // assign the default messages
            this.messages[lang] = { ... this.defaultMessages };
        }

        // check if the lang file exists in the project directory and merge the messages
       if (this.path && existsSync(`${this.path}/${lang}.js`)) {
            let customMessages = require(`${this.path}/${lang}.js`);
            customMessages = customMessages.default || customMessages;
            this.messages[lang] = mergeDeep(this.messages[lang], customMessages);
        }

    }
};

export default lang;