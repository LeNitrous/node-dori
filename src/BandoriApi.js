const request = require('superagent');
const utils = require('./utils.js');
const cron = require('cron');
const fs = require('fs');
const Constants = require('./Constants.js');

const Band = require('./models/Band.js')
const Koma = require('./models/Koma.js');
const Card = require('./models/Card.js');
const Music = require('./models/Music.js');
const Event = require('./models/Event.js');
const Character = require('./models/Character.js');

const ConnectionError = utils.ConnectionError;
const EmptyResponseError = utils.EmptyResponseError;
const InvalidParameterError = utils.InvalidParameterError;

const serverRegion = [
    "jp",   // Japan
    "tw",   // Taiwan
//  "kr",   // Korea
//  "en",   // International
]

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
                    if (!error && response.status === 200)
                        resolve(response.body);
                    else
                        reject(new ConnectionError(error.status, error.response));
                });
        });
    }

    getCards() {
        return new Promise((resolve, reject) =>
            this.query('/card')
                .then(response => {
                    var cardArray = [];
                    response.data.forEach(elem => {
                        cardArray.push(new Card(elem, this.region))
                    });
                    resolve(cardArray);
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

    getCardByQuery(query) {
        return new Promise((resolve, reject) =>
            this.query('/card')
                .then(response => {
                    var nameFormat = query.find(str => { return str.match(/[a-zA-z]+[1-4]/g) });
                    var allowAttrs = ['powerful', 'power', 'pure', 'happy', 'cool'];
                    var allowMemberNames = [];
                    Object.values(this.constants.Characters)
                        .forEach((elem, index) => {
                            allowMemberNames[index] = elem.split(' ').pop().toLowerCase();
                        });
        
                    var rarity, id, attr;

                    id = query.filter(str => { return allowMemberNames.includes(str.toLowerCase()) }).shift();
                    rarity = (query.find(num => { return num.match(/[1-4]/g) })) ? 
                        query.find(num => { return num.match(/[1-4]/g) }) : undefined;
                    attr = query.filter(str => allowAttrs.includes(str.toLowerCase())).shift();
                    attr = (attr == 'power') ? 'powerful' : attr;

                    var search = {};
                    if (id)
                        search.characterId = allowMemberNames.indexOf(id) + 1;
                    if (rarity)
                        search.rarity = parseInt(rarity);
                    if (attr)
                        search.attr = attr;

                    if (Object.keys(search).length == 0)
                        reject(new InvalidParameterError());

                    response.data = response.data.filter(o => {
                        return o.title !== "ガルパ杯";
                    });
                        
                    var match = response.data.filter(o => {
                        return Object.keys(search).every(k => {
                            return o[k] === search[k];
                        });
                    });

                    match.sort((a, b) => {
                        if (a.rarity > b.rarity) return -1;
                        if (a.rarity < b.rarity) return 1;
                        return 0;
                    });

                    var result = [];
                    match.forEach(card => {
                        result.push(new Card(card, this.region));
                    });

                    resolve(result);
                })
                .catch(reject)
        );
    }

    getMusic() {
        return new Promise((resolve, reject) =>
            this.query('/music')
                .then(response => {
                    var musicArray = [];
                    response.data.forEach(elem => {
                        musicArray.push(new Music(elem, this.region))
                    });
                    resolve(musicArray);
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

    getMusicByQuery(term) {
        return new Promise((resolve, reject) =>
            this.query(`/music`)
                .then(response => {
                    term.map(str => { return str.toLowerCase() });
                    var allowBands = ['popipa', 'afuro', 'harohapi', 'pasupare', 'roselia', 'other'];
                    var allowTypes = ['cover', 'original'];

                    var term_band = term.filter(str => { return allowBands.includes(str) }).shift();
                    var term_type = term.filter(str => { return allowTypes.includes(str) }).shift();
                    var search = {};
                    
                    if (term_type == 'cover')
                        search.tag = 'anime';
                    else if (term_type == 'original')
                        search.tag = 'normal';

                    if (term_band != 'other')
                        search.bandId = allowBands.indexOf(term_band) + 1;
                    else {
                        response.data = response.data.filter(o => {
                            return o.bandId > 5
                        });
                    };

                    console.log(search);

                    var match = response.data.filter(o => {
                        return Object.keys(search).every(k => {
                            return o[k] === search[k];
                        });
                    });
                    var result = [];
                    match.forEach(elem => {
                        result.push(new Music(elem, this.region));
                    });

                    resolve(result);
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

    getKomas() {
        return new Promise((resolve, reject) => 
            this.query('/sfc')
                .then(response => {
                    var komaArray = [];
                    response.data.forEach(data => {
                        komaArray.push(new Koma(data, region));
                    });
                    resolve(komaArray);
                })
                .catch(reject)
        )
    }

    getKomaByID(id) {
        return new Promise((resolve, reject) => 
            this.query('/sfc')
                .then(response => {
                    var search = { singleFrameCartoonId: id };
                    var match = response.data.filter(o => {
                    return Object.keys(search).every(k => {
                        return o[k] === search[k];
                        });
                    });
                    resolve(new Koma(match));
                })
                .catch(reject)
        )
    }

    getBands() {
        return new Promise((resolve, reject) => 
            this.query('/band')
                .then(response => {
                    var bandArray = [];
                    response.forEach(data => {
                        bandArray.push(new Band(data, region));
                    });
                    resolve(bandArray);
                })
                .catch(reject)
        )
    }

    getBandByID(id) {
        return new Promise((resolve, reject) => 
            this.query('/band')
                .then(response => {
                    var search = { bandId: id };
                    var match = response.filter(o => {
                    return Object.keys(search).every(k => {
                        return o[k] === search[k];
                        });
                    });
                    resolve(new Band(match));
                })
                .catch(reject)
        )
    }
}

module.exports = BandoriApi;