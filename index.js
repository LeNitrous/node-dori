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
                        reject(new Error(error.status || error.response));
                });
        });
    }

    getCard(query) {
        return new Promise((resolve, reject) => {
            this.query('/card').then(response => {
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
                if (id) search.characterId = allowMemberNames.indexOf(id) + 1;
                if (rarity) search.rarity = parseInt(rarity);
                if (attr) search.attr = attr;

                if (Object.keys(search).length == 0)
                    reject(new Error('Invalid search terms.'));
                
                var data = response.data.reverse();
                var match = data.filter(o => {
                    return Object.keys(search).every(k => {
                        return o[k] === search[k];
                    });
                });

                match.sort((a, b) => {
                    if (a.rarity > b.rarity) return -1;
                    if (a.rarity < b.rarity) return 1;
                    return 0;
                });

                this.query(`/card/${match[0].cardId}`).then(response => {
                    var result = [];
                    result.push(new Card(response, this.region, true));
                    match.shift();
                    if (match.length > 0)
                        match.forEach(card => { result.push(new Card(card, this.region, false)) });
                    resolve(result);
                }).catch(reject)
            }).catch(reject);
        });
    }
}

module.exports = BandoriApi;