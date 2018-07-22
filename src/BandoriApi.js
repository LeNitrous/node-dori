const request = require('superagent');
const utils = require('./utils.js');
const Constants = require('./Constants.js');

const Band = require('./models/Band.js');
const Card = require('./models/Card.js');
const Gacha = require('./models/Gacha.js');
const Music = require('./models/Music.js');
const Event = require('./models/Event.js');
const Scenario = require('./models/Scenario.js');
const Character = require('./models/Character.js');

const InvalidParameterError = utils.InvalidParameterError;

class BandoriApi {
    constructor(options = {}) {
        this.region = options.region;
        this.apiUrl = `https://api.bangdream.ga/v1/${this.region}`;
        this.constants = Constants;
    }

    query(endpoint) {
        return new Promise((resolve, reject) => {
            if (!this.region)
                return reject(new Error('Region is not set'));
            request.get(this.apiUrl + endpoint)
                .set('User-Agent', 'node-dori')
                .end((error, response) => {
                    if (!error && response.status === 200) {
                        if (Object.keys(response.body).length === 0)
                            resolve(response.text);
                        else
                            resolve(response.body);
                    }
                    else
                        reject(new Error(error));
                });
        });
    }

    getCards() {
        return new Promise((resolve, reject) =>
            this.query('/card')
                .then(response => {
                    var dataMap = new Map();
                    response.data.forEach(card => {
                        dataMap.set(card.cardId, new Card(card, this.region));
                    });
                    resolve(dataMap);
                })
                .catch(reject)
        );
    }

    getCardByID(id) {
        return new Promise((resolve, reject) =>
            this.query(`/card/${id}`)
                .then(response => {
                    if (isNaN(id)) reject(new InvalidParameterError());
                    resolve(new Card(response, this.region));
                })
                .catch(reject)
        );
    }

    getMusic() {
        return new Promise((resolve, reject) =>
            this.query('/music')
                .then(response => {
                    var songMap = new Map();
                    response.data.forEach(song => {
                        songMap.set(song.musicId, new Music(song, this.region));
                    });
                    resolve(songMap);
                })
                .catch(reject)
        );
    }

    getMusicByID(id) {
        return new Promise((resolve, reject) =>
            this.query(`/music/${id}`)
                .then(response => {
                    if (isNaN(id)) reject(new InvalidParameterError());
                    resolve(new Music(response, this.region));
                })
                .catch(reject)
        );
    }

    getCurrentEvent() {
        return new Promise((resolve, reject) =>
            this.query('/event')
                .then(response => {
                    resolve(new Event(response, this.region));
                })
                .catch(reject)
        );
    }

    getBands() {
        return new Promise((resolve, reject) => 
            this.query('/band')
                .then(response => {
                    var bandMap = new Map();
                    response.forEach(data => {
                        bandMap.set(band.bandId, new Band(band));
                    });
                    resolve(bandMap);
                })
                .catch(reject)
        )
    }

    getBandByID(id) {
        return new Promise((resolve, reject) => 
            this.query('/band')
                .then(response => {
                    var search = { bandId: id };
                    var band = response.filter(o => {
                    return Object.keys(search).every(k => {
                        return o[k] === search[k];
                        });
                    });
                    resolve(new Band(band));
                })
                .catch(reject)
        )
    }

    getCharacterByID(id) {
        return new Promise((resolve, reject) => 
            this.query(`/chara/${id}`)
                .then(response => {
                    resolve(new Character(response));
                })
                .catch(reject)
        )
    }

    getDataVersion() {
        return new Promise((resolve, reject) => 
            this.query(`/version/res`)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        )
    }

    getGachas() {
        return new Promise((resolve, reject) =>
            this.query(`/gacha`)
                .then(response => {
                    var gachaMap = new Map();
                    response.data.forEach(gacha => {
                        gachaMap.set(gacha.gachaId, new Gacha(gacha, this.region));
                    });
                    resolve(gachaMap);
                })
                .catch(reject)
        );
    }

    getActiveGachas() {
        return new Promise((resolve, reject) =>
            this.query(`/gacha`)
                .then(response => {
                    var gachas = response.data.map(gacha => new Gacha(gacha, this.region))
                        .filter(gacha => !gacha.getState());
                    resolve(gachas);
                })
                .catch(reject)
        );
    }

    getDatabase() {
        return new Promise((resolve, reject) => {
            if (!this.region)
                return reject(new Error('Region is not set'));
            request.get(`https://res.bangdream.ga/static/MasterDB_${region}.json`)
                .set('User-Agent', 'node-dori')
                .end((error, response) => {
                    if (!error && response.status === 200)
                        resolve(response.body);
                    else if (!response)
                        reject(new ConnectionError(error.status, error.response));
                    else
                        reject(new Error(error));
                })
        });
    }
}

module.exports = BandoriApi;