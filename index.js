const request = require('superagent');
const utils = require('./utils.js');
const cron = require('cron');
const fs = require('fs');
const Constants = require('./Constants.js');

const Card = require('./models/Card.js');
const Music = require('./models/Music.js');
const Event = require('./models/Event.js');

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
        return new Promise((resolve, reject) => {
            this.query('/card')
                .then(response => {
                    var cardArray = [];
                    response.data.forEach(elem => {
                        cardArray.push(new Card(elem, this.region))
                    });
                    resolve(cardArray);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    getCardByID(id) {
        return new Promise((resolve, reject) => {
            this.query(`/card/${id}`)
                .then(response => {
                    if (isNaN(id)) reject(new InvalidParameterError());
                    resolve(new Card(response, this.region));
                })
                .catch(error => {
                    if (error.status == 400) reject(new EmptyResponseError());
                    reject(error);
                });
        });
    }

    getCardByQuery(query) {
        return new Promise((resolve, reject) => {
            this.query('/card')
                .then(response => {
                    var nameFormat = query.find(str => { return str.match(/[a-zA-z]+[1-4]/g) });
                    var allowAttrs = ['powerful', 'power', 'pure', 'happy', 'cool'];
                    var allowMemberNames = [];
                    Object.values(this.constants.Characters)
                        .forEach((elem, index) => {
                            if (index == 0) return;
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
                });
        });
    }

    getMusic() {
        return new Promise((resolve, reject) => {
            this.query('/music')
                .then(response => {
                    var musicArray = [];
                    response.data.forEach(elem => {
                        musicArray.push(new Music(elem, this.region))
                    });
                    resolve(musicArray);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    getMusicByID(id) {
        return new Promise((resolve, reject) => {
            this.query(`/music/${id}`)
                .then(response => {
                    if (isNaN(id)) reject(new InvalidParameterError());
                    resolve(new Music(response, this.region));
                })
                .catch(error => {
                    if (error.status == 400) reject(new EmptyResponseError());
                    reject(error);
                });
        });
    }

    getCurrentEvent() {
        return new Promise((resolve, reject) => {
            this.query('/event')
                .then(response => {
                    resolve(new Event(response, this.region));
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}

module.exports = BandoriApi;