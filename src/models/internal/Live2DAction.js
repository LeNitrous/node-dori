const Constants = require('../../Constants.js');

class Live2DAction {
    constructor(data, region) {
        this.id = data.live2dId;
        this.motion_name = data.motion;
        this.voice = `https://res.bangdream.ga/assets/sound/voice/system/${data.voice}.mp3`;
        this.voice_name = data.voice;
        this.category = data.live2dCategory;
        this.text = data.serif;
        this.character = {
            id: data.characterId,
            name: Constants.Characters[data.characterId]
        }
    }
}

module.exports = Live2DAction;