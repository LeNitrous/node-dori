const Constants = require('../Constants.js');

class Scenario {
    constructor(data, region) {
        this.environment = {
            background: data.env.backgroundImage,
            bgm: data.env.bgm
        }
        this.talk = mapScenarioTalk(data.talk);
    }
}

function mapScenarioTalk(talk) {
    var TALK_MAP = [];
    talk.forEach(line => {
        TALK_MAP.push({
            text: line.text,
            character: {
                id: line.charaId,
                name: Constants.Characters[line.charaId]
            },
            displayName: line.charaName,
            voice: "https://res.bangdream.ga/" + line.voice
        });
    });
    return TALK_MAP;
}

module.exports = Scenario;