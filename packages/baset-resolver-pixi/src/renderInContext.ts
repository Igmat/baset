import 'pixi.js';
declare const basetSandbox: { basetResolverPixi__ObjectToRender: PIXI.DisplayObject };

const objectToRender = basetSandbox.basetResolverPixi__ObjectToRender;
const bounds = objectToRender.getBounds();
const app = new PIXI.Application(bounds.width, bounds.height);
const canvas = document.body.appendChild(app.view);

app.stage.addChild(objectToRender);
app.render();

export const renderedResult = new Promise((resolve, reject) =>
    app.ticker.addOnce(() =>
        resolve(canvas.toDataURL('image/png'))));
