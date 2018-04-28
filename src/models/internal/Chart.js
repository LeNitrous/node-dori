class Chart {
    constructor(data, diff) {
        this.difficulty = diff;
        this.bpm = data.bpm;
        this.notes = data.notes.slice(1);
        this.fever = data.fever;
    }
}

module.exports = Chart;