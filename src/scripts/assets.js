let assets = {};
const AMOUNT = 22;
for(let i = 1; i <= AMOUNT; i++) {
  // footer pattern
  if(i === AMOUNT) {
    assets[i] = i + '.png';
  }
  else {
    assets[i] = i + '.jpg';
  }
}

export default assets;
