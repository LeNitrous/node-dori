const utils = require('../utils.js');
const Constants = require('../Constants.js');

const Card = require('./Card.js');
const Music = require('./Music.js');
const Stamp = require('./Stamp.js');

class GameEvent {
    constructor(data, region) {
        var music = [];
        var chara = [];
        var rewardchara = [];
        var rewardstamp, rewards;
        
        this.id = data.eventId;
        this.name = data.eventName;
        this.type = data.eventType;
        this.image = `https://res.bangdream.ga/assets-${region}/homebanner_banner_event${data.eventId}.png`
        this.enableFlag = data.enableFlag;                              // ?
        this.start = data.startAt;                                      // Event opens to players
        this.end = data.endAt;                                          // Event closes to players
        this.publicStart = data.publicStartAt;                          // Event banner
        this.publicEnd = data.publicEndAt;
        this.distributionStart = data.distributionStartAt;              // Reward distribution
        this.distributionEnd = data.distributionEndAt;
        this.aggregateEnd = data.aggregateEndAt;                        // Event fully closes to players
        this.bgmFileName = data.bgmFileName;

        var attribute = data.detail.attributes[0].attr || data.detail.attributes[0].attribute;
        this.attr = attribute;

        rewardstamp = data.pointRewards.filter(reward => {
            return reward.rewardType == 'stamp'
        });
        this.stamp = loadStampData(rewardstamp[0].rewardId, region);

        rewards = data.pointRewards.filter(reward => {
            return reward.rewardType == 'situation'
        });
        rewards.forEach(o => {
            rewardchara.push(loadCardData(o.rewardId, region))
        });
        this.rewardCards = rewardchara;

        data.detail.characters.forEach(o => {
            chara.push(Constants.Members[o.characterId]);
        });
        this.characters = chara;

        this.music = [];
        if (data.eventType == 'challenge' || data.eventType == 'versus') {
            data.detail.musics.forEach(o => {
                music.push(loadMusicData(o.musicId, region));
            });
            this.music = music;
        }
    }
}

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

function loadMusicData(id, region) {
    var data = utils.getSync(`https://api.bangdream.ga/v1/${region}/music`).data;
    var search = { "musicId": id };

    var res = data.filter(o => {
        return Object.keys(search).every(k => {
            return o[k] == search[k];
        });
    });

    return new Music(res[0]);
};

function loadStampData(id, region) {
    var data = utils.getSync(`https://api.bangdream.ga/v1/${region}/stamp`).data;
    var search = { "stampId": id };

    var res = data.filter(o => {
        return Object.keys(search).every(k => {
            return o[k] == search[k];
        });
    });

    return new Stamp(res[0]);
};

module.exports = GameEvent;