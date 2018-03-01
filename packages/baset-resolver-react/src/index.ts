import { AbstractResolver, dataTypes } from 'baset-core';
import React from 'react';
import ReactDOM from 'react-dom/server';

export default class ReactResolver extends AbstractResolver {
    match = async (obj: any) =>
        React.isValidElement(obj);
    resolve = async (obj: any) => ({
        value: ReactDOM.renderToString(obj),
        [dataTypes.html]: 'react',
    });
}
