require('../styles/index.less');
import CSSPlugin from 'gsap/CSSPlugin';
import TextPlugin from 'gsap/TextPlugin';
const EventEmitter = require('wolfy87-eventemitter');
window.__ee__ = new EventEmitter();

const gsapPlugins = [ CSSPlugin, TextPlugin ];

window.qs = document.querySelector.bind(document);
window.qsa = document.querySelectorAll.bind(document);

require('./preloader');
require('./fontLoader');
require('./app');
require('./text');
