import * as React from 'react';
import { jsxFn } from './index';

export const value = (
    <div>
        {jsxFn('s', 's')}
        {jsxFn('abc', 'cba')}
        {jsxFn('s', 'abc')}
        {jsxFn('abc', 's')}
    </div>
);
