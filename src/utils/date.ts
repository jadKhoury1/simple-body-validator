'use strict';

/**
 * Convert value to date instance
 */
 export function toDate(value: any): Date|null {
    const date = Date.parse(value);

    return !isNaN(date) ? new Date(date) : null;
}