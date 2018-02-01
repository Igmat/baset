import { AbstractBaseliner } from 'baset-core';
import * as beautify from 'json-beautify';

export default class ExportReader extends AbstractBaseliner {
    create = async (result: Promise<any>[]) => {
        const results = await Promise.all(result);

        return (results.length > 1)
            ? beautify(results, undefined, 4, 20)
            : beautify(results[0], undefined, 4, 20);
    }
}
