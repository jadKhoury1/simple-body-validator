export function builValidationdMethodName(rule: string): string {
    return rule.split('_').map(rule => `${rule[0].toUpperCase()}${rule.slice(1)}`).join('');
};