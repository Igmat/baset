const body = document.getElementsByTagName('body')[0];
body.appendChild(document.createElement('div'));
body.appendChild(document.createElement('div'));
body.appendChild(document.createElement('div'));

export function sampleFn(a: number, b: number) {
    const divNumber = document.getElementsByTagName('div').length;
    return a + b * divNumber;
}
