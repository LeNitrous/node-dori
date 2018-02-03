const utilget = require('../utils.js');

class Gacha {
    constructor(data, region) {
        var self = this;
        var pick = [];

        this.id = data.gachaId;
        this.name = data.gachaName;
        this.resName = data.resourceName;
        this.sequence = data.seq;
        this.description = data.descripton;
        if (data.annotation)
            this.annotation = data.annotation;
        this.start = data.publishedAt;
        this.end = data.closedAt;
        this.period = data.gachaPeriod;
        this.image = `https://res.bangdream.ga/assets-jp/gacha/screen/${data.resourceName}_logo.png`;

        var cards = data.details.filter(o => {
            return o.pickup == true;
        });
        cards.forEach(o => {
            pick.push(loadCardData(o.situationId, region));
        });
        this.pickup = pick;
    }
};

function loadCardData(id, region) {
    var card = utils.loadData(`https://api.bangdream.ga/v1/${region}/card`).data;
    var search = { "cardId": id };

    var res = data.filter(o => {
        return Object.keys(search).every(k => {
            return o[k] == search[k];
        });
    });

    return new Card(res[0]);
};

module.exports = Gacha;