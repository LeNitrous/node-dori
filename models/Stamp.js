class Stamp {
    constructor(data) {
        this.id = data.stampId;
        this.type = data.stampType;
        this.seq = data.seq;
        this.image = `https://res.bangdream.ga/assets-jp/stamp/01_${data.imageName}.png`;
    }
}

module.exports = Stamp;