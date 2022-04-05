'use strict';

import { ValidationDataInterface } from '../types';
import { deepFind, deepSet, dotify } from '../utils/object';

const validationData: ValidationDataInterface = {

    /**
     * initialize and gather data for the given attribute.
     */
    initializeAndGatherData: function(attribute: string, masterData: object) {
        let data: object = dotify(this.initializeAttributeOnData(attribute, masterData));

        return { ...data, ...this.extractValuesFromWildCards(masterData, data, attribute) };
    },

    /**
     * Gather a copy of the attribute data filled with ant missing attributes.
     */
    initializeAttributeOnData: function (attribute: string, masterData: object): object {
        const explicitPath: string = this.getLeadingExplicitAttributePath(attribute);
        
        let data: object = this.extractDataFromPath(explicitPath, JSON.parse(JSON.stringify(masterData)));

        if (attribute.indexOf('*') === -1 || attribute.indexOf('*') === attribute.length - 1) {
            return data;
        }

        deepSet(data, attribute, null);
        return data;
    },


    /**
     * Get all of the exact attribute values for a given wildcard attribute.
     */
    extractValuesFromWildCards(masterData: object, data: object, attribute: string): object {

        let keys: string[] = [];
        const pattern: RegExp  = new RegExp('^' + attribute.replace(/\*/g, '[^\.]*'));
        let result: RegExpMatchArray = null;

        for (let key in data) {
            result = key.match(pattern);
            if (result) {
                keys.push(result[0]);
            }
        }

        data = {};
        keys.forEach(key => data[key] = deepFind(masterData, key));

        return data;
    },

    /**
     * Get the explicit part of the attribute name - ex: 'foo.bar.*.baz' -> 'foo.bar'
     */
    getLeadingExplicitAttributePath: function(attribute: string): string  {
       return attribute.split('*')[0].replace(/\.$/, '');
    },

    /**
     * Extract data based on the given dot-notated path.
     */
    extractDataFromPath(path: string, masterData: object): object {

        let results: object = {};
        let value: any = deepFind(masterData, path);

        if (value !== undefined) {
            deepSet(results, path, value);
        }

        return results;
    }
};

export default validationData;