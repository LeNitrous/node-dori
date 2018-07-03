const utils = require('../utils.js');

class Character {
    constructor(data) {
        this.id = data.characterId;
        this.band = data.bandId;
        this.type = data.characterType;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.ruby = data.ruby;
        this.sdAssetBundleName = data.sdAssetBundleName;
        this.profile = data.profile;
    }

    getCharacterLocale() {
        return new Promise((resolve, reject) => 
            utils.loadCharaData(this.id)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        );        
    }

    getLive2DInfo() {
        return new Promise((resolve, reject) => 
            utils.loadLive2DCharacterInfo(this.id, this.region)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        );
    }
}

module.exports = Character;