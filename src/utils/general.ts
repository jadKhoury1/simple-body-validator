export function getSize(value: any) {
    if (typeof value === 'number') {
        return value;
    } else if (typeof value === 'string' ||  Array.isArray(value)) {
        return value.length;
    }

    return -1;
}