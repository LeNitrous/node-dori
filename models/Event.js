const utils = require('../utils.js');
const Constants = require('../Constants.js');

class GameEvent {
    constructor(data, region) {  
        this.id = data.eventId;
        this.region = region;
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
        this.rewards = data.pointRewards;
        this.details = data.detail;
        this.attribute = data.detail.attributes[0].attr || data.detail.attributes[0].attribute;

        data.detail.characters.forEach(o => {
            chara.push(Constants.Members[o.characterId]);
        });
        this.characters = chara;
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

    getStamp() {
        var rewardStamp = this.rewards.filter(reward => {
            return reward.rewardType == 'stamp'
        });
        return utils.loadStampData(rewardStamp[0].rewardId, this.region);
    }

    getCards() {
        var cards = [];
        var rewardCards = this.rewards.filter(reward => {
            return reward.rewardType == 'situation'
        }).forEach(o => {
            cards.push(utils.loadCardData(o.rewardId, this.region));
        });
        return cards;
    }

    getMusic() {
        var music = []
        if (this.eventType != 'challenge' || this.eventType != 'versus')
            return undefined;
        this.details.musics.forEach(o => {
            music.push(utils.loadMusicData(o.musicId, this.region));
        });
        return music;
    }

    getColor() {
        return Constants.Attributes[this.attribute].color;
    }

    getIcon() {
        return Constants.Attributes[this.attribute].icon;
    }
}

module.exports = GameEvent;