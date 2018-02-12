class Koma {
    constructor(data, region) {
        this.id = data.singleFrameCartoonId;
        this.image = data.assetAddress;
        this.title = data.title;
        this.assetBundleName = data.assetBundleName;
    }
}

module.exports = Koma;