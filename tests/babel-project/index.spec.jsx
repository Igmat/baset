import React from 'react';
import { jsxFn } from './index';

export const value = (
    <div>
        {jsxFn('s', 's')}
        {jsxFn('abc', 'cba')}
        {jsxFn('s', 'abc')}
        {jsxFn('abc', 's')}
    </div>
);

export default {
    'value1': jsxFn(1, 1),
    'value2': jsxFn('q', 'q'),
};
