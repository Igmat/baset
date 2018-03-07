import { AbstractEnvironment, utils } from 'baset-core';
import express from 'express';
import { Server } from 'http';
import path from 'path';

export interface IBrowserEnvOptions {
    staticFolder?: string;
    serverPort?: number;
}

export default class BrowserEnv extends AbstractEnvironment {
    private serveUrl = 'about:blank';
    private server?: Server;
    constructor(public options: IBrowserEnvOptions) {
        super(options);
        if (options && (options.staticFolder || options.serverPort)) {
            const port = options.serverPort || 1337;
            const folder = options.staticFolder || process.cwd();
            this.serveUrl = `http://localhost:${port}/`;

            const app = express();
            app.use('/', express.static(folder));
            setTimeout(() => this.server = app.listen(port));
        }
    }
    getContextImport(sandbox: utils.IDictionary<any>) {
        sandbox.basetBrowserEnv__StaticUrl = this.serveUrl;

        return path.resolve(__dirname, 'runInContext').split('\\').join('/');
    }
    dispose() {
        if (this.server) this.server.close();
    }
}
