class Stamp {
    constructor(data, region) {
        this.id = data.stampId;
        this.region = region;
        this.type = data.stampType;
        this.seq = data.seq;
        this.image = `https://res.bangdream.ga/assets-${region}/stamp/01_${data.imageName}.png`;
    }
}

module.exports = Stamp;