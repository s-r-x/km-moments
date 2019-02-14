import * as PIXI from 'pixi.js';
import app from './init';

export function processTexture(texture, targetWidth, targetHeight, textDrawer) {
  const rt = PIXI.RenderTexture.create(targetWidth, targetHeight);
  const sprite = new PIXI.Sprite(texture);

  // https://gist.github.com/ClickSimply/581823db9cdc8d94ed3f78c1a548f50d
  const bgSize = { x: targetWidth, y: targetHeight };
  var sp = {x:sprite.width,y:sprite.height};
  var winratio = bgSize.x/bgSize.y;
  var spratio = sp.x/sp.y;
  var scale = 1;
  var pos = new PIXI.Point(0,0);
  if(winratio > spratio) {
    //photo is wider than background
    scale = bgSize.x/sp.x;
    pos.y = -((sp.y*scale)-bgSize.y)/2
  } else {
    //photo is taller than background
    scale = bgSize.y/sp.y;
    pos.x = -((sp.x*scale)-bgSize.x)/2
  }

  sprite.scale = new PIXI.Point(scale,scale);
  sprite.position = pos;
  app.renderer.render(sprite, rt);
  if(textDrawer) {
    //TODO::fucking hell man...
    const container = new PIXI.Container();
    const bgSprite = new PIXI.Sprite(rt);
    const textContainer = textDrawer();
    container.addChild(bgSprite);
    container.addChild(textContainer);
    const anotherRt = PIXI.RenderTexture.create(targetWidth, targetHeight);
    app.renderer.render(container, anotherRt);
    return anotherRt;
  }
  return rt;
}
export function processFooterTexture(texture, targetWidth, targetHeight, textDrawer) {
  const rt = PIXI.RenderTexture.create(targetWidth, targetHeight);
  const tilingSprite = new PIXI.extras.TilingSprite(texture, targetWidth, targetHeight);
  const textContainer = textDrawer();
  const container = new PIXI.Container();
  container.addChild(tilingSprite);
  container.addChild(textContainer);
  app.renderer.render(container, rt);
  return rt;
}

export const RESIZE_DELAY = 250;
export const IMAGES_BASE_URL = '/images/';

export const mapNumber = (x, a, b, c, d,) => (x - a) * ( (d - c) / (b - a) ) + c;

