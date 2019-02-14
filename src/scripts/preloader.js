import TweenLite from 'gsap/TweenLite';
import { loader } from 'pixi.js';
import { IMAGES_BASE_URL, mapNumber } from './utils';
import { Sine, Expo, Back } from 'gsap/EasePack';
import assets from './assets';


const $root = qs('.preloader');
const $spinner = $root.querySelector('.preloader--circle path');
const $text = $root.querySelector('.preloader--progress');
const spinnerLength = $spinner.getTotalLength();
TweenLite.set($spinner, {
  strokeDasharray: spinnerLength,
  strokeDashoffset: spinnerLength,
  strokeOpacity: 1,
  rotation: -90,
  transformOrigin: "center center",
});


const progressObj = {
  progress: 0,
};

for(let key in assets) {
  loader.add(key, IMAGES_BASE_URL + assets[key]);
}
loader.load(loadHandler);
loader.on('progress', progressHandler);
loader.onError.add((err) => console.error(err));

__ee__.on('ready', readyHandler);

function progressHandler({ progress }) {
  const dashOffset = mapNumber(progress, 0, 100, spinnerLength, 0);
  TweenLite.to($spinner, .5, {
    strokeDashoffset: dashOffset,
    ease: 'linear',
  });
  TweenLite.to(progressObj, 0.5, {
    progress,
    onUpdate() {
      $text.textContent = Math.round(progressObj.progress);
    }
  });
}

function loadHandler() {
  __ee__.emit('assets_loaded');
}

function readyHandler() {
  TweenLite.set($spinner, {
    dashOffset: spinnerLength,
  });
  $text.textContent = 100;
  setTimeout(() => {
  TweenLite.to($root, 1.2, {
    y: '-100%',
    ease: Expo.easeInOut,
    onComplete() {
      $root.parentNode.removeChild($root);
    }
  });
  }, 100);
}
