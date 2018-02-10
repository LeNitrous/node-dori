A Promise-based NodeJS module used to interact with [Bandori.party](https://bandori.party) and [Bandori Database](https://bangdream.ga) APIs.

Installation
===
`$ npm install node-dori`

Example
===
```js
const BandoriAPI = require('node-dori');
const API = new BandoriAPI({
    region: 'jp'
});

API.getCardsByID(382)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
    });
```

##### Returns
```
Card {
  id: 382,
  region: 'jp',
  title: '冬仕様',
  character: { id: 15, name: 'Michelle' },
  band: 'Hello, Happy World!',
  attribute: 'pure',
  rarity: 3,
  maxLevel: 40,
  maxLevelTrained: 50,
  image: 
   { normal: 'https://res.bangdream.ga/assets/characters/resourceset/res015016_card_normal.png',
     normal_trim: 'https://res.bangdream.ga/assets/characters/resourceset/res015016_trim_normal.png',
     normal_icon: 'https://res.bangdream.ga/assets/thumb/chara/card00007_res015016_normal.png',
     trained: 'https://res.bangdream.ga/assets/characters/resourceset/res015016_card_after_training.png',
     trained_trim: 'https://res.bangdream.ga/assets/characters/resourceset/res015016_trim_after_training.png',
     trained_icon: 'https://res.bangdream.ga/assets/thumb/chara/card00007_res015016_after_training.png' },
  parameterMax: { performance: 8422, technique: 8984, visual: 9950, total: 27356 },
  parameterStoryBonus: [ 200, 500 ],
  parameterTrainBonus: 300 }
  ```
