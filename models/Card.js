const request = require('sync-request');
const Constants = require('../Constants.js');

class Card {
    constructor(data, region, locale, showSkill) {
        this.region = region;
        this.id = data.cardId;
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
        if (data.parameterMap)
            this.parameters = mapCardParameters(data.parameterMap);
        if (showSkill)
            this.skill = mapSkillParameters(this.id, this.region);
        console.log(showSkill)
        this.parameterStoryBonus = bonusStoryStats(data.rarity),
        this.parameterTrainBonus = bonusTrainStats(data.rarity)
        if (locale) {
            var locale_data = JSON.parse(request('GET', `https://bandori.party/api/cards/${this.id + 500}/`, {
                'headers': { 'user-agent': 'node-dori' }
            }).getBody().toString());
            this.locale = {
                id: locale_data.id,
                name: locale_data.name,
                attr: locale_data.i_attribute,
                icon: locale_data.image,
                icon_trained: locale_data.image_trained,
                skill_name: locale_data.skill_name,
                skill_type: locale_data.i_skill_type,
                skill_details: locale_data.skill_details,
                side_skill_type: locale_data.i_side_skill_type,
                side_skill_details: locale_data.side_skill_details
            }
        };
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

function mapSkillParameters(cardId, region) {
    function mapSkillDetail(skillDetail) {
        var SKILL_MAP = [];
        for (var k in skillDetail) {
            var SKILL = skillDetail[k];
            SKILL_MAP[SKILL.skillLevel] = SKILL.simpleDescription;
        }
        return SKILL_MAP;
    };
    var data = JSON.parse(request('GET', `https://api.bangdream.ga/v1/${region}/skill/cardId/${cardId}`, {
            'headers': { 'user-agent': 'node-dori' }
        }).getBody().toString());
    return {
        id: data.skillId,
        name: data.skillName,
        details: mapSkillDetail(data.skillDetail)
    };
};

String.prototype.format = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

module.exports = Card;