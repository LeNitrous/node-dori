class Koma {
    constructor(data, region) {
        this.id = data.singleFrameCartoonId;
        this.image = "https://res.bangdream.ga" + data.assetAddress;
        this.title = data.title;
        this.assetBundleName = data.assetBundleName;
    }
}

module.exports = Koma;