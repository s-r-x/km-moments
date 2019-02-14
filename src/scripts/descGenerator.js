const fs = require('fs');

const words = ["Птица", "лес", "текст", "солнце"];
let list = [];
for(let i = 1; i <= 21; i++) {
  const word1 = words[Math.round(Math.random() * (words.length-1))];
  const word2 = words[Math.round(Math.random() * (words.length-1))];
  const word3 = words[Math.round(Math.random() * (words.length-1))];
  const text = word1 + ' ' + word2 + ' ' + word3;
  list.push(text);
}
fs.writeFileSync('./descriptions.json', JSON.stringify({ list }));
