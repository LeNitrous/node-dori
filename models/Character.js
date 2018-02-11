const utils = require('../utils.js');

class Character {
    constructor(data, region) {
        this.id = data.characterId;
        this.region = region;
        this.band = data.bandId;
        this.type = data.characterType;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.ruby = data.ruby;
        this.sdAssetBundleName = data.sdAssetBundleName;
        this.profile = data.profile;
    }

    toString() {
        return this.lastName + this.firstName;
    }

    getCharacterLocale() {
        return new Promise((resolve, reject) => 
            utils.loadCharaData(this.id)
                .then(response => {
                    resolve(response);
                })
        );        
    }

    getLive2DInfo() {
        return new Promise((resolve, reject) => 
            utils.loadLive2DCharacterInfo(this.id, this.region)
                .then(response => {
                    resolve(response);
                })
        )
    }
}

module.exports = Character;