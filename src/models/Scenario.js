const Constants = require('../Constants.js');

class Scenario {
    constructor(data, api) {
        this.api = api;
        this.environment = {
            background: data.env.backgroundImage,
            bgm: data.env.bgm
        }
        this.talk = data.talk.map(line => {
            return {
                text: line.text,
                character: {
                    id: line.charaId,
                    name: Constants.Characters[line.charaId]
                },
                displayName: line.charaName,
                voice: `${api.resourceUrl}/${line.voice}`
            }
        });
    }
}

module.exports = Scenario;