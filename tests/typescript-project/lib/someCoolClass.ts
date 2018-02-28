function logParamTypes(target: any, key: string) {
    const types = Reflect.getMetadata('design:paramtypes', target, key);
    const s = types.map((a: any) => a.name).join();
}

export class SomeCoolClass {
    private a = 1000;
    private b = 300;

    @logParamTypes
    getSum() {
        return this.a + this.b;
    }
}
