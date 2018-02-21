const utils = require('../utils.js');
const Constants = require('../Constants.js');

class Card {
    constructor(data, region) {
        this.id = data.cardId;
        this.region = region;
        this.title = data.title;
        this.character = {
            id: data.characterId,
            name: Constants.Characters[data.characterId]
        },
        this.band = Constants.Bands[Math.floor((data.characterId - 1) / 5) + 1],
        this.attribute = data.attr,
        this.rarity = data.rarity,
        this.maxLevel = data.levelLimit
        if (data.rarity >= 3)
            this.maxLevelTrained = data.levelLimit + 10;
        this.image = {
            normal: `https://res.bangdream.ga/assets/characters/resourceset/${data.cardRes}_card_normal.png`,
            normal_trim: `https://res.bangdream.ga/assets/characters/resourceset/${data.cardRes}_trim_normal.png`,
            normal_icon: `https://res.bangdream.ga/assets/thumb/chara/card${getResBatchID(data.cardId)}_${data.cardRes}_normal.png`,
            trained: `https://res.bangdream.ga/assets/characters/resourceset/${data.cardRes}_card_after_training.png`,
            trained_trim: `https://res.bangdream.ga/assets/characters/resourceset/${data.cardRes}_trim_after_training.png`,
            trained_icon: `https://res.bangdream.ga/assets/thumb/chara/card${getResBatchID(data.cardId)}_${data.cardRes}_after_training.png`,
        }
        this.parameterMax = {
            performance: data.maxPerformance,
            technique: data.maxTechnique,
            visual: data.maxVisual,
            total: data.totalMaxParam
        }
        if (data.parameterMap)
            this.parameters = mapCardParameters(data.parameterMap);
        if (data.episodes)
            this.episodes = mapCardEpisodes(data.episodes);
        this.parameterStoryBonus = bonusStoryStats(data.rarity);
        this.parameterTrainBonus = bonusTrainStats(data.rarity);
    }

    toString() {
        return `${this.rarity}★ 【${this.title}】 ${this.character.name}`
    }

    getLocale() {
        return new Promise((resolve, reject) => 
            utils.loadLocaleCardData(this.id)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        );
    }

    getCharacter() {
        return new Promise((resolve, reject) => 
            utils.loadCharaData(this.character.id, this.region)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        )
    }

    getCharacterLocale() {
        return new Promise((resolve, reject) => 
            utils.loadLocaleCharaData(this.character.id)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        );        
    }

    getBand() {
        return new Promise((resolve, reject) => 
            utils.loadBandData(this.band, this.region)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        )
    }
    
    getSkill() {
        return new Promise((resolve, reject) => 
            utils.loadCardSkillData(this.id, this.region)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        );
    }
    
    getDetails() {
        return new Promise((resolve, reject) =>
            utils.loadCardData(this.id, this.region)
                .then(response => {
                    resolve({
                        parameters: response.parameters,
                        episodes: response.episodes
                    });
                })
                .catch(reject)
        )
    }

    getEpisode(name) {
        var search = { type: name };
        var match = this.episodes.filter(o => {
            return Object.keys(search).every(k => {
                return o[k] === search[k];
            });
        }).shift();
        if (match == undefined)
            throw new utils.InvalidParameterError();
        return new Promise((resolve, reject) =>
            utils.loadCardScenarioData(match.scenario, this.region)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        )
    }

    getColor() {
        return Constants.Attributes[this.attribute].color;
    }

    getIcon() {
        return Constants.Attributes[this.attribute].icon;
    }
};

function bonusStoryStats(rarity) {
    switch(rarity) {
        case 1:
            return [100, 200];
        case 2:
            return [150, 300];
        case 3:
            return [200, 500];
        case 4:
            return [250, 600];
        default:
            return;
    };
};

function bonusTrainStats(rarity) {
    switch(rarity) {
        case 3:
            return 300;
        case 4:
            return 400;
        default:
            return null;
    };
};

function getResBatchID(id) {
    var batchID = Math.floor(id / 50);
    batchID = "00000" + batchID;
    return batchID.substr(batchID.length - 5);
};

function mapCardParameters(parameterMap) {
    var PARAM_MAP = [];
    for (var k in parameterMap) {
        if (parameterMap.hasOwnProperty(k)) {
            var PARAM = parameterMap[k];
            PARAM_MAP[PARAM.level] = {
                technique: PARAM.technique,
                performance: PARAM.performance,
                visual: PARAM.visual,
                total: PARAM.technique + PARAM.performance + PARAM.visual
            };
        };
    };
    return PARAM_MAP;
};

function mapCardEpisodes(episodes) {
    var EPISODE_MAP = [];
    episodes.entries.forEach(episode => {
        EPISODE_MAP.push({
            id: episode.episodeId,
            type: episode.episodeType,
            scenario: episode.scenarioId
        });
    })
    return EPISODE_MAP;
}

module.exports = Card;