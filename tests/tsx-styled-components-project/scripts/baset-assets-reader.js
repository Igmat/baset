const { AbstractReader } = require('baset-core');

const mockCode = `
const path = require('path');
module.exports.default = path.relative(process.cwd(), __filename).split(path.sep).join('/');
`
class AssetsReader extends AbstractReader {
	constructor(options) {
		super(options);
		this.exts = ['.css', '.less', '.jpg', '.png', '.svg', '.woff', '.woff2']

		this.read = (filePath, spec) => spec;

		this.registerHook = (addHook, addFileResolver) =>
			addHook(
				(code, filename) => mockCode,
				{
					exts: this.exts,
					matcher: filename => /\.(css|less|jpg|png|svg|woff|woff2)$/i.test(filename)
				});
	}
}

exports.default = AssetsReader;
