export class SomeClass {
    constructor(a: number, b: number, c: number)
    constructor(private a = 1, private b = 10, c: number) {
        this.b = b * c;
     }

    getSum() {
        return this.a + this.b;
    }

    getMultipliedSum(multiplier: number) {
        return this.getSum() * multiplier;
    }

    getStringOrNumberSum(a: string, b: string): string;
    getStringOrNumberSum(a: number, b: number): number;
    getStringOrNumberSum(a: string, b: number): undefined;
    getStringOrNumberSum(a: number, b: string): undefined;
    getStringOrNumberSum(a: string | number, b: string | number) {
        if (typeof a === 'string') {
            if (typeof b === 'string') return a + b + this.getSum().toString();

            return;
        }
        if (typeof b === 'number') return a + b + this.getSum();

        return;
    }
}
