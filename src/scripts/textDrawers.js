import { Text, TextStyle, Container } from 'pixi.js';
import app from './init';

const FILL_COLOR = 0xffffff;
const FOOTER_FILL_COLOR = 0x000000;
const COMMON_BREAKPOINT = 680;
const FOOTER_BREAKPOINT = 400;

const HERO_STYLE ={
    fontFamily: 'Lobster',
    fontSize: 72,
    lineHeight: 66,
    fill: FILL_COLOR,
    align: "center",
};
export function drawHeadText() {
  const container = new Container();
  const screenWidth = app.screen.width;

  let headStyle = new TextStyle(HERO_STYLE);
  if(screenWidth <= COMMON_BREAKPOINT) {
    headStyle.fontSize = 40;
    headStyle.lineHeight = 42;
  }
  const subheadStyle = new TextStyle({
    fontFamily: 'PT Sans',
    fontSize: 22,
    fill: FILL_COLOR,
    align: "center",
  });
  const headText = new Text('Мгновения\nХанты-Мансийска', headStyle);
  const subheadText = new Text('Фотограф: Струсь Татьяна', subheadStyle);
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;
  headText.y = -headText.height / 2 + 30;
  headText.x = -headText.width / 2;
  subheadText.x = -subheadText.width / 2;
  subheadText.y = 130;
  if(screenWidth <= COMMON_BREAKPOINT) {
    subheadText.y = 95;
  }
  container.addChild(headText);
  container.addChild(subheadText);
  return container;
}

export function drawFooterText() {
  const container = new Container();
  const screenWidth = app.screen.width;

  let headStyle = new TextStyle(HERO_STYLE);
  headStyle.fill = FOOTER_FILL_COLOR;
  headStyle.lineHeight = 100;
  if(screenWidth <= FOOTER_BREAKPOINT) {
    headStyle.fontSize = 30;
  }
  else if(screenWidth <= COMMON_BREAKPOINT) {
    headStyle.fontSize = 40;
  }
  const headText = new Text('Спасибо за просмотр', headStyle);
  container.x = app.screen.width / 2;
  container.y = app.screen.height / 2;
  headText.y = -headText.height / 2 + 30;
  headText.x = -headText.width / 2;
  container.addChild(headText);
  return container;

}
