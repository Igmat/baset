import { circularReference, dataTypes } from 'baset-core';

const rxEscapable =
    /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

// table of character substitutions
class Meta {
    readonly '\b' = '\\b';
    readonly '\t' = '\\t';
    readonly '\n' = '\\n';
    readonly '\f' = '\\f';
    readonly '\r' = '\\r';
    readonly '"' = '\\"';
    readonly '\\' = '\\\\';
}
const meta = new Meta();
let gap: string;
let indent: string;
let rep: Function | string[] | undefined;
let shouldReplaceZeroIndex = false;

function quote(value: string) {

    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.

    rxEscapable.lastIndex = 0;

    return rxEscapable.test(value)
        ? `"${value.replace(rxEscapable, a => {
            const c = meta[a as keyof Meta];

            return typeof c === 'string'
                ? c
                : `\\u${(`0000${a}`.charCodeAt(0).toString(16)).slice(-4)}`;
        })}"`
        : `"${value}"`;
}

// tslint:disable-next-line:cyclomatic-complexity
function str(key: string | number, holder: any, limit: number): string {
    // Produce a string from holder[key].
    const mind = gap;
    const originalValue = holder[key];
    const jsonValue = (originalValue && typeof originalValue === 'object' && typeof originalValue.toJSON === 'function')
        ? originalValue.toJSON(key)
        : originalValue;
    const value = (typeof rep === 'function')
        ? rep.call(holder, key, jsonValue)
        : jsonValue;

    // What happens next depends on the value's type.

    switch (typeof value) {
        case 'string':
            return quote(value);
        case 'number':
            return isFinite(value)
                ? String(value)
                : 'Infinity';
        case 'boolean':
            return String(value);
        case 'object':
            // Due to a specification blunder in ECMAScript, typeof null is 'object',
            // so watch out for that case.
            if (!value) return 'null';
            if (value && value[circularReference]) {
                return (shouldReplaceZeroIndex)
                    ? value[circularReference].replace(/^exports\[0\]/, 'exports')
                    : value[circularReference];
            }
            if (value && value[dataTypes.error]) {
                return `Throws: ${value[dataTypes.error].stack || value[dataTypes.error]}`;
            }

            // Make an array to hold the partial results of stringifying this object value.
            gap += indent;
            const partial = [];

            // Is the value an array?
            if (Array.isArray(value)) {
                // The value is an array. Stringify every element. Use null as a placeholder
                // for non-JSON values.
                for (let i = 0, length = value.length; i < length; i += 1) {
                    partial[i] = str(i, value, limit) || 'null';
                }
                // Join all of the elements together, separated with commas, and wrap them in
                // brackets.
                const v = partial.length === 0
                    ? '[]'
                    : gap
                        ? (gap.length + partial.join(', ').length + 4 > limit)
                            ? `[\n${gap}${partial.join(`,\n${gap}`)}\n${mind}]`
                            : `[ ${partial.join(', ')} ]`
                        : `[${partial.join(', ')}]`;
                gap = mind;

                return v;
            }

            // If the replacer is an array, use it to select the members to be stringified.

            if (rep instanceof Array) {
                for (let i = 0, length = rep.length; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        const k = rep[i];
                        const v = str(k, value, limit);
                        if (v) {
                            partial.push(`${quote(k)}${gap ? ': ' : ':'}${v}`);
                        }
                    }
                }
            } else {

                // Otherwise, iterate through all of the keys in the object.

                for (const k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        const v = str(k, value, limit);
                        if (v) {
                            partial.push(`${quote(k)}${gap ? ': ' : ':'}${v}`);
                        }
                    }
                }
            }

            // Join all of the member texts together, separated with commas,
            // and wrap them in braces.
            const result = partial.length === 0
                ? '{}'
                : gap
                    ? (gap.length + partial.join(', ').length + 4 > limit)
                        ? `{\n${gap}${partial.join(`,\n${gap}`)}\n${mind}}`
                        : `{ ${partial.join(', ')} }`
                    : `{${partial.join(', ')}}`;
            gap = mind;

            return result;
        default: return '';
    }
}

export function beautify(value: any, replacer?: Function | string[], space?: number, limit?: number, isExportSingle = false) {
    shouldReplaceZeroIndex = isExportSingle;

    // The stringify method takes a value and an optional replacer, and an optional
    // space parameter, and returns a JSON text. The replacer can be a function
    // that can replace values, or an array of strings that will select the keys.
    // A default replacer method can be provided. Use of the space parameter can
    // produce text that is more easily readable.

    gap = '';
    indent = '';

    if (!limit) limit = 0;

    if (typeof limit !== 'number') {
        throw new Error('beaufifier: limit must be a number');
    }

    // If the space parameter is a number, make an indent string containing that
    // many spaces.

    if (typeof space === 'number') {
        for (let i = 0; i < space; i += 1) {
            indent += ' ';
        }

        // If the space parameter is a string, it will be used as the indent string.

    } else if (typeof space === 'string') {
        indent = space;
    }

    // If there is a replacer, it must be a function or an array.
    // Otherwise, throw an error.

    rep = replacer;
    if (replacer && typeof replacer !== 'function' &&
        (typeof replacer !== 'object' ||
            typeof replacer.length !== 'number')) {
        throw new Error('beautifier: wrong replacer parameter');
    }

    // Make a fake root object containing our value under the key of ''.
    // Return the result of stringifying the value.

    return str('', { '': value }, limit);
}
