class Chart {
    constructor(data, diff) {
        this.difficulty = diff;
        this.data = data.slice(1);
        this.combo = data.length - 1;
    }
}

module.exports = Chart;