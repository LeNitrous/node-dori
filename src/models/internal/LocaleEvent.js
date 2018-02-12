const Constants = require('../../Constants.js');

class LocaleEvent {
    constructor(data) {
        this.name = data.name;
        this.start = data.start_date;
        this.end = data.end_date;
        this.attribute = data.i_boost_attribute;
        this.type = data.i_type;
        this.image = data.image;
        this.stamp = data.rare_stamp;
        this.stamp_text = data.stamp_translation;
        this.reward_cards = {
            main: data.main_card - 500,
            secondary: data.secondary_card - 500
        }
        this.characters = mapEventCharacters(data.boost_members);
    }
}

function mapEventCharacters(characters) {
    var CHARA_MAP = [];
    characters.forEach(chara => {
        CHARA_MAP.push({
            id: chara - 5,
            name: Constants.Characters[chara - 5]
        });
    });
    return CHARA_MAP;
}

module.exports = LocaleEvent;