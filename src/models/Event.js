const utils = require('../utils.js');
const Constants = require('../Constants.js');

class GameEvent {
    constructor(data, api) {  
        this.id = data.eventId;
        this.api = api;
        this.region = api.region;
        this.name = data.eventName;
        this.type = data.eventType;
        this.image = `${api.resourceUrl}/assets-${api.region}/homebanner_banner_event${data.eventId}.png`
        this.enableFlag = data.enableFlag;                              // ?
        this.start = data.startAt;                                      // Event opens to players
        this.end = data.endAt;                                          // Event closes to players
        this.publicStart = data.publicStartAt;                          // Event banner
        this.publicEnd = data.publicEndAt;
        this.distributionStart = data.distributionStartAt;              // Reward distribution
        this.distributionEnd = data.distributionEndAt;
        this.aggregateEnd = data.aggregateEndAt;                        // Event fully closes to players
        this.bgmFileName = data.bgmFileName;
        this.rewards = data.pointRewards;
        this.details = data.detail;
        this.attribute = data.detail.attributes[0].attr || data.detail.attributes[0].attribute;

        var chara = [];
        data.detail.characters.forEach(o => {
            chara.push(Constants.Characters[o.characterId]);
        });
        this.characters = chara;
    }

    getState() {
        return utils.getState(this.start, this.end);
    }

    getStamp() {
        var rewardStamp = this.rewards.filter(reward => {
            return reward.rewardType == 'stamp'
        });
        return new Promise((resolve, reject) => 
            utils.loadStampData(rewardStamp[0].rewardId, this)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        );
    }

    getLocale() {
        return new Promise((resolve, reject) =>
            utils.loadLocaleEventData(this.id)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        );
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

    getMusic() {
        var music = [];
        if (!this.details.musics)
            return music;
        this.details.musics.forEach(o => {
            music.push(utils.loadMusicData(o.musicId, this));
        });
        return new Promise((resolve, reject) => 
            Promise.all(music)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        );
    }

    getColor() {
        return Constants.Attributes[this.attribute].color;
    }

    getIcon() {
        return Constants.Attributes[this.attribute].icon;
    }
}

module.exports = GameEvent;