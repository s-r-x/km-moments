import * as PIXI from 'pixi.js';
import app from './init';
import TimelineLite from 'gsap/TimelineLite';
import TweenLite from 'gsap/TweenLite';
import { Back, Sine, Power1, Expo } from 'gsap/EasePack';
const { Sprite, Container } = PIXI;
const { resources } = PIXI.loader;
import { scaleTexture, RESIZE_DELAY, mapNumber } from './utils';
import sortBy from 'lodash.sortby';
import throttle from 'lodash.throttle';
const descList = require('./descriptions.json').list;



// ^-^ GLOBAL VARS ^-^
const DOM = {
  desc: qs('.desc-container'),
};
let screenWidth = app.screen.width;
let screenHeight = app.screen.height;
let activeItem = 0;
let AMOUNT = setAmount(screenWidth);
let BLOCK_WIDTH = screenWidth / AMOUNT;
let delta = 0;
let startY = 0;
let isGrab = false;
let grabbedItem = null;
const ITEM_Y_PADDING = 60;
let JUMP_MIN_DELTA = screenHeight / 4;
let picturesAmount = 0;
let containers = [];
let isTextHidden = false;


// ^-^ INIT APP ^-^ 
const assetsPromise = new Promise(r => __ee__.on('assets_loaded', r));
const fontPromise = new Promise(r => __ee__.on('font_loaded', r));
Promise.all([ assetsPromise, fontPromise ])
.then(onload);
function onload() {
  processImages();
  initEventListeners();
  cursorGrabOff();
  __ee__.emit('ready');
}


// ^-^ UTILS ^-^ 
// return an array with weight and index pairs
function calcWeights() {
  if(grabbedItem === null) {
    return containers.map((_, i) => [ i, i ]);
  }
  const weights = containers.map((_, i) => [ Math.abs(grabbedItem - i), i ]);
  const sorted = sortBy(weights, arr => arr[0])
  return sorted;
}
function updateText() {
  if(activeItem === 0) {
    DOM.desc.textContent = '';
    return;
  }
  const text = descList[activeItem];
  TweenLite.to(DOM.desc, 1, {
    text,
    ease: Expo.easeOut,
  });
}
function resetPositions() {
  const tl = new TimelineLite();
  const sorted = calcWeights();
  const itemsToStagger = sorted.map(([_, i]) => containers[i]);
  if(itemsToStagger.length !== 0) {
    tl.staggerTo(itemsToStagger, .7, {
      ease: Back.easeOut,
      y: -(activeItem * screenHeight),
    }, 0.02);
  }
  resetGlobalData();
}
function resetGlobalData() {
  grabbedItem = null;
  isGrab = false;
}
function setAmount(screenWidth) {
  const MAX_AMOUNT = 23;
  return Math.min(MAX_AMOUNT, Math.floor(screenWidth / 65));
}
function cursorGrabOn() {
  app.renderer.view.style.cursor = 'grabbing';
}
function cursorGrabOff() {
  app.renderer.view.style.cursor = 'grab';
}
function processImages() {
  // probably resize event, need to clear old textures 
  if(containers.length !== 0) {
    containers.forEach(container => container.destroy({ children: true, texture: true, baseTexture: true }));
    containers = [];
  }
  const textures = Object.keys(resources).map(key => 
    scaleTexture(resources[key].texture, screenWidth, screenHeight));

  picturesAmount = textures.length;
  // crop every texture into AMOUNT parts
  // textures = 10, AMOUNT = 25, sprites = 250
  let sprites = [];
  for(let i = 0; i < textures.length; i++) {
    sprites[i] = [];
    for(let j = 0; j < AMOUNT; j++) {
      let cropRect;
      if(j === AMOUNT - 1) {
        cropRect = new PIXI.Rectangle(j * BLOCK_WIDTH, 0, BLOCK_WIDTH - 1, screenHeight);
      }
      else {
        cropRect = new PIXI.Rectangle(j * BLOCK_WIDTH, 0, BLOCK_WIDTH + 1, screenHeight);
      }
      const texture = new PIXI.Texture(textures[i], cropRect);
      const readySprite = new Sprite(texture);
      readySprite.x = BLOCK_WIDTH * j;
      readySprite.y = i * screenHeight;
      sprites[i][j] = readySprite;
    }
  }
  // create container for every single sprite column
  for(let i = 0; i < sprites[0].length; i++) {
    const container = new PIXI.Container();
    for(let j = 0; j < sprites.length; j++) {
      container.addChild(sprites[j][i]);
    }
    containers.push(container);
    app.stage.addChild(container);
  }
}
function hideText() {
  const $text = qs('.text-container');
  TweenLite.to($text, .8, {
    ease: Sine.easeOut,
    opacity: 0,
    onComplete() {
      $text.classList.add('hide');
    }
  });
}


// ^-^ EVENT HANDLERS ^-^
function mousedownListener(e) {
  cursorGrabOn();
  if(!isTextHidden) {
    hideText();
    isTextHidden = true;
  }
  isGrab = true;
  startY = e.data.global.y;
}
function mouseupListener(e) {
  if(!isGrab) {
    return;
  }
  cursorGrabOff();
  const absDelta = Math.abs(delta);
  if(absDelta < JUMP_MIN_DELTA) {
    resetPositions();
  }
  else if(delta < 0) {
    jumpNext();
  }
  else if(delta > 0) {
    jumpPrev();
  }
}

function jump() {
  const itemsToStagger = calcWeights().map(([_, index ]) => containers[index]);
  if(!isTextHidden) {
    hideText();
  }
  const tl = new TimelineLite();
  tl.staggerTo(itemsToStagger, .55, {
    ease: Back.easeOut,
    y: -(activeItem * screenHeight),
  }, 0.015);
  updateText(); 
  resetGlobalData();
}
function mouseoutListener(e) {
  mouseupListener(e);
}
function jumpNext() {
  if(activeItem + 1 >= picturesAmount) {
    return resetPositions();  
  }
  activeItem += 1;
  jump();
}
function jumpPrev() {
  if(activeItem <= 0) {
    return resetPositions();
  }
  activeItem -= 1;
  jump();

}
function mousemoveListener(e) {
  if(!isGrab) {
    return;
  }
  const { x, y } = e.data.global
  delta = y - startY; 
  grabbedItem = Math.floor(x / BLOCK_WIDTH);
  const sorted = calcWeights();
  sorted.forEach(([weight, index]) => {
    const container = containers[index];
    const globalOffset = -(activeItem * screenHeight);
    if(container === containers[grabbedItem]) {
      TweenLite.to(container, .3, {
        y: delta + globalOffset,
      });
    } else {
      let newY;
      // negative offset
      if(delta < 0) {
        newY = globalOffset + (delta > -ITEM_Y_PADDING * weight ? 0 : delta + weight * ITEM_Y_PADDING);
      } 
      // positive offset
      else {
        newY = globalOffset + (delta < ITEM_Y_PADDING * weight ? 0 : delta - weight * ITEM_Y_PADDING);
      }
      TweenLite.to(container, .3, {
        y: newY,
      });
    }
  });
}
// TODO:: Uncaught TypeError: Cannot read property 'position' of null -> some weird error from gsap on resize event sometimes
//  still works btw
const resizeListener = throttle((e) => {
  screenWidth = document.documentElement.clientWidth, screenHeight = document.documentElement.clientHeight;
  AMOUNT = setAmount(screenWidth);
  BLOCK_WIDTH = screenWidth / AMOUNT;
  app.renderer.resize(screenWidth, screenHeight);
  processImages();
  TweenLite.set(containers, {
    y: -(activeItem * screenHeight),  
  });
}, RESIZE_DELAY);
function keystrokeListener({ keyCode }) {
  const ARROW_LEFT = 37;
  const ARROW_RIGHT = 39;
  const ARROW_TOP = 38;
  const ARROW_BOTTOM = 40;
  switch(keyCode) {
    case ARROW_LEFT:
    case ARROW_TOP:
      jumpPrev();
      break;
    case ARROW_RIGHT:
    case ARROW_BOTTOM:
      jumpNext();
      break;
    default:
      null;
  }
}
function wheelListener({ deltaY }) {
  if(deltaY > 0) {
    jumpNext();
  }
  else if(deltaY < 0) {
    jumpPrev();
  }
}

function initEventListeners() {
  app.renderer.plugins.interaction.on('pointerdown', mousedownListener);
  app.renderer.plugins.interaction.on('pointerup', mouseupListener);
  app.renderer.plugins.interaction.on('pointerout', mouseoutListener);
  app.renderer.plugins.interaction.on('pointermove', mousemoveListener);
  window.addEventListener('resize', resizeListener);
  window.addEventListener('keydown', keystrokeListener);
  window.addEventListener('wheel', wheelListener);
}

