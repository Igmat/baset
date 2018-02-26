import { AbstractBaseliner, circularReference } from 'baset-core';
import { beautify } from './beautifier';

export default class ExportReader extends AbstractBaseliner {
    create = async (result: Promise<any>[]) => {
        const results = await Promise.all(result);
        const isExportSingle = results.length === 1;

        return (!isExportSingle)
            ? beautify(results, undefined, 4, 20, isExportSingle)
            : beautify(results[0], undefined, 4, 20, isExportSingle);
    }
}
