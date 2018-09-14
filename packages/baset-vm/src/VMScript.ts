import vm from 'vm';

export class VMScript {
    private wrapped = false;
    private compiled?: vm.Script;
    constructor(private code: string, public filename = 'vm.js') {
    }
    wrap(prefix: string, postfix: string) {
        if (this.wrapped) {
            return this;
        }
        this.code = prefix + this.code + postfix;
        this.wrapped = true;

        return this;
    }
    compile() {
        if (this.compiled) {
            return this.compiled;
        }
        const compiled = new vm.Script(this.code, {
            filename: this.filename,
            displayErrors: false,
        });
        this.compiled = compiled;

        return compiled;
    }
}
