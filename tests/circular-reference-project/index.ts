const sampleObj: { [index: string]: any } = {
    a: {},
};
sampleObj.circularReference = sampleObj;
sampleObj.a.deepCircularReference = sampleObj;
sampleObj.b = {
    a: sampleObj.a,
};

export {
    sampleObj,
};
