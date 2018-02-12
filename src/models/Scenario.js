const Constants = require('../../Constants.js');

class Scenario {
    constructor(data, region) {
        this.environment = {
            background: data.backgroundImage,
            bgm: data.bgm
        }
        this.talk = mapScenarioTalk(data.talk);
    }
}

function mapScenarioTalk(talk) {
    var TALK_MAP = [];
    talk.forEach(line => {
        talkArray.push({
            text: line.text,
            character: {
                id: line.charaId,
                name: Constants.Characters[line.charaId]
            },
            displayName: line.charaName,
            voice: line.voice
        });
    });
    return TALK_MAP;
}

module.exports = Scenario;