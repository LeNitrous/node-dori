class Chart {
    constructor(data, music, difficulty) {
        this.id = music.id;
        this.difficulty = difficulty;
        this.bpm = data.metadata.bpm;
        this.maxCombo = data.metadata.combo;
        this.notes = data.objects.filter(note => note.type === "Object");
        this.points = data.objects.filter(point => point.type === "System");
    }
}

module.exports = Chart;