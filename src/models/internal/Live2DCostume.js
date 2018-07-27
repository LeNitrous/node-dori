const utils = require('../../utils.js');
const Constants = require('../../Constants.js');

class Live2DCostume {
    constructor(data, region) {
        this.id = data.costumeId;
        this.region = region;
        this.description = data.description;
        this.prerequisite = data.howToGet;
        this.assetBundleName = data.assetBundleName;
        this.resourceName = data.sdResourceName;
        this.publishedAt = data.publishedAt;
        this.texture = `${api.resourceUrl}/live2d/${data.assetBundleName}_texture_00.png`;
        this.character = {
            id: data.characterId,
            name: Constants.Characters[data.characterId]
        }
    }

    getModelData() {
        return new Promise((resolve, reject) => 
            utils.loadLive2DModelData(this.id, this.region)
                .then(data => {
                    resolve(data)
                })
                .catch(reject)
        );
    }
}

module.exports = Live2DCostume;