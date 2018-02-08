const body = document.getElementsByTagName('body')[0];
body.appendChild(document.createElement('div'));
body.appendChild(document.createElement('div'));
body.appendChild(document.createElement('div'));

function sampleFn(a, b) {
    const divNumber = document.getElementsByTagName('div').length;
    return a + b * divNumber;
}

module.exports.sampleFn = sampleFn;
