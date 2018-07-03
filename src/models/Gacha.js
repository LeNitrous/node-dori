const utils = require('../utils.js');

class Gacha {
    constructor(data) {
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
        this.image = `https://res.bangdream.ga/assets-${region}/gacha/screen/${data.resourceName}_logo.png`;
        this.details = data.details;
    }

    getState() {
        return utils.getState(this.start, this.end);
    }

    getDuration() {
        if (this.getState != 1)
            return utils.formatTimeLeft(this.end)
        else
            return null;
    }

    getCards() {
        var cards = [];
        return new Promise((resolve, reject) => 
            Promise.all(cards)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        );
    }
}

module.exports = Gacha;