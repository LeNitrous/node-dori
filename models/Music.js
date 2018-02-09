const utils = require('../utils.js');

class Music {
    constructor(data, region) {
        this.id = data.musicId;
        this.region = region;
        this.bgm = `https://res.bangdream.ga/assets/sound/` + data.bgmId + '.mp3';
        this.jacket = `https://res.bangdream.ga/assets/musicjacket/` + data.jacketImage + '_jacket.png';
        this.title = data.title;
        this.band = data.bandName;
        this.arranger = data.arranger;
        this.composer = data.composer;
        this.lyricist = data.lyricist;

        if (data.difficulty)
            this.difficulty = mapDifficulty(data.difficulty)

        this.type = typify(data.tag);
    }

    toString() {
        return `${this.band} - ${this.title}`;
    }

    getChart(diff) {
        var allowed = ['easy', 'normal', 'hard', 'expert'];
        if (!allowed.includes(diff) && diff != undefined)
            throw new utils.InvalidParameterError('Invalid difficulty');
        var loadDiffs;
        if (diff == undefined) {
            loadDiffs = [
                utils.loadChartData(this.id, 'easy', this.region),
                utils.loadChartData(this.id, 'normal', this.region),
                utils.loadChartData(this.id, 'hard', this.region),
                utils.loadChartData(this.id, 'expert', this.region)
            ];
        }
        else {
            loadDiffs = [utils.loadChartData(this.id, diff, this.region)];
        };
        return new Promise((resolve, reject) => {
            Promise.all(loadDiffs)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    if (error.status == 400) reject(new utils.EmptyResponseError());
                    reject(error);
                });
        });
    }
};

function typify(string) {
    if (string == 'anime') return 'Cover';
    if (string == 'normal') return 'Original';
};

function mapDifficulty(difficulty) {
    var newObj = {};
    difficulty.forEach(diff => {
        newObj[diff.difficulty] = {
            name: diff.difficulty,
            level: diff.level,
            maxCombo: diff.combo,
            scores: {
                solo: {
                    C: diff.scoreC,
                    B: diff.scoreB,
                    A: diff.scoreA,
                    S: diff.scoreS,
                    SS: diff.scoreSS
                },
                multi: mapMultiScores(diff.multiLiveScoreMap)
            }
        };
    });
    return newObj;
};

function mapMultiScores(multiLiveScoreMap) {
    var newObj = {};
    for (var prop in multiLiveScoreMap) {
        newObj[multiLiveScoreMap[prop].multiLiveDifficultyType] = {
            C:  multiLiveScoreMap[prop].scoreC,
            B:  multiLiveScoreMap[prop].scoreB,
            A:  multiLiveScoreMap[prop].scoreA,
            S:  multiLiveScoreMap[prop].scoreS,
            SS: multiLiveScoreMap[prop].scoreSS
        };
    };
    return newObj;
};

module.exports = Music;