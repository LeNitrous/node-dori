const utils = require('../../utils.js');
const Constants = require('../../Constants.js');

class LocaleCard {
    constructor(data) {
        this.id = data.id;
        this.title = data.name;
        this.character = {
            id: data.member - 5,
            name: Constants.Characters[data.member - 5]
        }
        this.rarity = data.i_rarity
        this.attribute = data.i_attribute;
        this.image = {
            normal: data.art,
            normal_trim: data.transparent,
            normal_icon: data.image,
            trained: data.art_trained,
            trained_trim: data.transparent_trained,
            trained_icon: data.image_trained
        }
        this.skill = {
            name: data.skill_name,
            main_type: data.i_skill_type,
            side_type: data.i_side_skill_type,
            description: data.full_skill
        }
        this.parameter = {
            trained_max: {
                performance: data.performance_trained_max,
                technique: data.technique_trained_max,
                visual: data.visual_trained_max,
                total: data.performance_trained_max + data.technique_trained_max + data.visual_trained_max
            },
            max: {
                performance: data.performance_max,
                technique: data.technique_max,
                visual: data.visual_max,
                total: data.performance_max + data.technique_max + data.visual_max
            },
            min: {
                performance: data.performance_min,
                technique: data.technique_min,
                visual: data.visual_min,
                total: data.performance_min + data.technique_min + data.visual_min
            }
        }
    }

    toString() {
        return `${this.rarity}★ 【${this.title}】 ${this.character.name}`
    }
};

module.exports = LocaleCard;