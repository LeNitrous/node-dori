const request = require('superagent');
const utils = require('./utils.js');
const cron = require('cron');
const fs = require('fs');
const Constants = require('./Constants.js');

const Card = require('./models/Card.js');

const serverRegion = [
    "jp",   // Japan
    "tw",   // Taiwan
//  "kr",   // Korea
//  "en",   // International
]

class BandoriApi {
    constructor(options = {}) {
        this.region = options.region;
        this.locale = options.locale;
        this.apiUrl = `https://api.bangdream.ga/v1/${this.region}`;
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
                        reject(new Error(error.status || error.response));
                });
        });
    }

    getCard(query) {
        return new Promise((resolve, reject) => {
            this.query('/card').then(response => {
                var nameFormat = query.find(str => { return str.match(/[a-zA-z]+[1-4]/g) });
                var allowAttrs = ['powerful', 'power', 'pure', 'happy', 'cool'];
                var memberConst = Constants.Characters;
                for (var prop in memberConst) {
                    if (memberConst.hasOwnProperty(prop)) {
                        memberConst[prop] = memberConst[prop].split(' ')
                            .reverse()
                            .shift()
                            .toLowerCase();
                    };
                };
    
                var name, rarity, id, attr;
                if (nameFormat != undefined) {
                    name = nameFormat.slice(0, -1);
                    rarity = nameFormat.slice(-1);
                    id = utils.findProp(name, memberConst);
                }
                else {
                    name = query.filter(str => { !allowAttrs.includes(str) && str.match(/[a-zA-Z]/g) });
                    id = (name.length != 0) ? utils.findProp(name, memberConst) : undefined;
                    rarity = (query.find(num => { return num.match(/[1-4]/g) })) ? query.find(num => { return num.match(/[1-4]/g) }) : undefined;
                }
                attr = query.filter(str => allowAttrs.includes(str))[0];
                attr = (attr == 'power') ? 'powerful' : attr;
                var search = {};
                if (id) search.characterId = parseInt(id);
                if (rarity) search.rarity = parseInt(rarity);
                if (attr) search.attr = attr.toLowerCase();
                if (Object.keys(search).length == 0)
                    reject(new Error('Invalid search terms.'));
                
                var data = response.data.reverse();
                var match = data.filter(o => {
                    return Object.keys(search).every(k => {
                        return o[k] === search[k];
                    });
                });

                this.query(`/card/${match[0].cardId}`).then(response => {
                    var result = [];
                    result.push(new Card(response, this.region, this.locale, true));
                    match.shift();
                    if (match.length > 0)
                        match.forEach(card => { result.push(new Card(card, this.region, false, false)) });
                    resolve(result);
                }).catch(reject)
            }).catch(reject);
        });
    }
}

module.exports = BandoriApi;