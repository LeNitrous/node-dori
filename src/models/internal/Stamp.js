class Stamp {
    constructor(data, api) {
        this.id = data.stampId;
        this.region = api.region;
        this.type = data.stampType;
        this.seq = data.seq;
        this.image = `${api.resourceUrl}/assets-${this.region}/stamp/01_${data.imageName}.png`;
    }
}

module.exports = Stamp;