const utils = require('../utils.js');

class Music {
    constructor(data, api) {
        this.id = data.musicId;
        this.api = api;
        this.bgm = `https://res.bangdream.ga/assets/sound/` + data.bgmId + '.mp3';
        this.jacket = `https://res.bangdream.ga/assets/musicjacket/` + data.jacketImage + '_jacket.png';
        this.assetBundleName = data.chartAssetBundleName;
        this.title = data.title;
        this.band = data.bandName;
        this.arranger = data.arranger;
        this.composer = data.composer;
        this.lyricist = data.lyricist;
        this.description = data.description || '';
        this.publishTime = data.publishedAt;

        if (isNumberArray(data.difficulty))
            this.difficulty = mapDifficultyArray(data.difficulty);
        else
            this.difficulty = mapDifficulty(data.difficulty);

        this.type = data.tag;
    }

    toString() {
        return `${this.band} - ${this.title}`;
    }

    getDifficulty() {
        return new Promise((resolve, reject) =>
            utils.loadMusicData(this.id, this.region)
                .then(music => {
                    resolve(music.difficulty);
                })
                .catch(reject)
        );
    }

    getChart(diff) {
        diff = (typeof diff === 'string') ? diff.toLowerCase() : undefined;
        var allowed = ['easy', 'normal', 'hard', 'expert'];
        if (!allowed.includes(diff) && diff != undefined)
            throw new utils.InvalidParameterError('Invalid difficulty');
        var loadDiffs;
        if (diff == undefined) {
            loadDiffs = [
                utils.loadChartData(this, 'easy'),
                utils.loadChartData(this, 'normal'),
                utils.loadChartData(this, 'hard'),
                utils.loadChartData(this, 'expert')
            ];
        }
        else {
            loadDiffs = [utils.loadChartData(this, diff)];
        };
        return new Promise((resolve, reject) => 
            Promise.all(loadDiffs)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        );
    }
};

function isNumberArray(array) {
    return array.every(elem => { return typeof elem === "number" })
}

function mapDifficulty(difficulty) {
    var DIFF_MAP = {};
    difficulty.forEach(diff => {
        DIFF_MAP[diff.difficulty] = {
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
    return DIFF_MAP;
};

function mapDifficultyArray(difficulty) {
    return {
        easy: {
            level: difficulty[0]
        },
        normal: {
            level: difficulty[3]
        },
        hard: {
            level: difficulty[2]
        },
        expert: {
            level: difficulty[1]
        }
    };
}

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