import * as PIXI from 'pixi.js';

const app = new PIXI.Application(document.documentElement.clientWidth, document.documentElement.clientHeight, {
  transparent: true,
  background: 0x000000,
  view: document.getElementById('canvas'),
});

export default app;
