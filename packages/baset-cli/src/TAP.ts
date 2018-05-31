import { tap, TestError } from 'baset-core';
import { Readable } from 'stream';

function serializeError(err: TestError) {
    return {
        name: err.name,
        message: err.message,
        at: err.stack
            ? err.stack
                .split('\n')
                .slice(1, 2)
                .map(line => line.replace(/at/, '').trim())
                .shift()
            : '',
        actual: err.data.actual.split('\n').join('\n       '),
        expected: err.data.expected.split('\n').join('\n       '),
    };
}

function start(): string {
    return 'TAP version 13\n';
}
function test(title: string, options: tap.Options): string {
    let directive = '';

    if (!options.passed && options.todo) directive = '# TODO';
    if (options.passed && options.skip) directive = '# SKIP';

    const comments = options.comment
        ? typeof options.comment === 'string'
            ? [options.comment]
            : options.comment
        : [];
    const comment = comments
        .map(line => `  * ${line}`)
        .join('\n');

    const output = [
        `# ${title}`,
        `${options.passed ? 'ok' : 'not ok'} ${options.index} - ${title} ${directive}`.trim(),
        options.comment,
    ];

    if (!options.passed && !options.todo) {
        const obj = serializeError(options.error);

        output.push([
            '  ---',
            `    name: ${obj.name}`,
            `    message: ${obj.message}`,
            `    at: ${obj.at}`,
            '    actual:',
            '      |',
            `       ${obj.actual}`,
            '    expected:',
            '      |',
            `       ${obj.expected}`,
            '  ...',
        ].join('\n'));
    }

    return output.filter(Boolean).join('\n') + '\n';
}
function end(stats: tap.IStats): string {
    return [
        `\n1..${stats.passed + stats.failed + stats.skipped + stats.todo}`,
        `# tests ${stats.passed + stats.failed + stats.skipped}`,
        `# pass ${stats.passed}`,
        stats.skipped && `# skip ${stats.skipped}`,
        `# fail ${stats.failed + stats.crashed + stats.todo}\n`,
    ].filter(Boolean).join('\n');
}

export function getTapStream(results: Promise<{ name: string; options: tap.Options }>[]) {
    const tapStream = new Readable({
        objectMode: true,
        read() { /* we don't need implementation of this method here */ },
    });
    const finish = (async () => {
        const stats: tap.IStats = {
            crashed: 0,
            failed: 0,
            passed: 0,
            skipped: 0,
            todo: 0,
        };
        tapStream.push(start());
        for (const result of results) {
            const { name, options } = await result;
            if (options.passed) {
                stats.passed++;
                if (options.skip) stats.skipped++;
            } else {
                stats.failed++;
                if (options.todo) stats.todo++;
            }
            tapStream.push(test(name, options));
        }
        tapStream.push(end(stats));
        tapStream.emit('end');
        tapStream.emit('close');

        return stats;
    })();

    return { tapStream, finish };
}
