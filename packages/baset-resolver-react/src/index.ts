import { AbstractResolver, dataTypes } from 'baset-core';
import prettyFormat from 'pretty-format';
import React, { ReactElement } from 'react';
import ReactTestRenderer from 'react-test-renderer';
const { ReactElement, ReactTestComponent } = prettyFormat.plugins;

export default class ReactResolver extends AbstractResolver {
    match = async (obj: {} | null | undefined) =>
        React.isValidElement(obj);
    resolve = async (obj: ReactElement<unknown>) => ({
        value: prettyFormat(ReactTestRenderer.create(obj).toJSON(), {
            plugins: [ReactTestComponent],
            printFunctionName: false,
        }),
        [dataTypes.html]: 'react',
    });
}
