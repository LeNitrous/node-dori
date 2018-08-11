const request = require('superagent');

/**
 * The main module in interacting with game API through a public service.
 * 
 * @param {Object.<String>} options.region The game region to use. Leave blank to use default.
 * @param {Object.<String>} options.apiUrl The API url to use. Leave blank to use default.
 * @param {Object.<String>} options.resourceUrl The resource server to use. Leave blank to use default.
 * @class Bandori
 */
class Bandori {
    constructor(options = {}) {
        this.region = options.region || "jp";
        this.apiUrl = options.apiURL || `https://api.bandori.ga/v1/${this.region}`;
        this.resourceUrl = options.resourceURL || `https://res.bandori.ga/`;
    }

    /**
     * Internal method.
     *
     * @param {String} endpoint
     * @returns {Object|String} Server response 
     * @memberof Bandori
     */
    _query(endpoint) {
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

    /**
     * Get all in game card data.
     *
     * @returns {Object.<Number, Object>} Card data map
     * @memberof Bandori
     */
    getCards() {
        return new Promise((resolve, reject) =>
            this._query('/card')
                .then(response => {
                    var dataMap = new Map();
                    response.data.forEach(card => {
                        dataMap.set(card.cardId, card);
                    });
                    resolve(dataMap);
                })
                .catch(reject)
        );
    }

    /**
     * Get more detailed in game card data.
     *
     * @param {Number} id
     * @returns {Object} Card data
     * @memberof Bandori
     */
    getCardByID(id) {
        return new Promise((resolve, reject) => {
            var card;
            this._query(`/card/${id}`)
                .then(response => {
                    if (isNaN(id)) reject(new Error('ID argument can\'t be empty!'));
                    card = response;
                    return this._query(`/skill/cardId/${id}`);
                })
                .then(response => {
                    card.skill = response;
                    resolve(card);
                })
                .catch(reject)
        });
    }

    /**
     * Get all in game music data.
     *
     * @returns {Object.<Number, Object>} Music data map
     * @memberof Bandori
     */
    getMusic() {
        return new Promise((resolve, reject) =>
            this._query('/music')
                .then(response => {
                    var songMap = new Map();
                    response.data.forEach(song => {
                        songMap.set(song.musicId, song);
                    });
                    resolve(songMap);
                })
                .catch(reject)
        );
    }

    /**
     * Get more detailed in game music data.
     * Include second argument to get chart data.
     * Difficulty names are same in game.
     * 
     * @param {Number} id
     * @param {String} difficulty
     * @returns {Object} Music data object
     * @memberof Bandori
     */
    getMusicByID(id, difficulty) {
        return new Promise((resolve, reject) => {
            if (isNaN(id)) reject(new Error('ID argument can\'t be empty!'));
            if (difficulty !== undefined) {
                difficulty = difficulty.toLowerCase();
                if (!["easy", "normal", "hard", "expert", "special"].includes(difficulty))
                    reject(new Error ('Difficulty is invalid!'));
                return this._query(`/music/chart/${id}/${difficulty}`)
                            .then(response => resolve(response) ).catch(reject);
            }
            else {
                return this._query(`/music/${id}`)
                            .then(response => resolve(response) ).catch(reject);
            }
        });
    }

    /**
     * Gets the most recent event.
     *
     * @returns {Object} Event object
     * @memberof Bandori
     */
    getEvent() {
        return new Promise((resolve, reject) => {
            var event, stamp;
            return this._query('/event')
                .then(response => {
                    event = response;
                    stamp = event.pointRewards.filter(item => item.rewardType === "stamp").shift();
                    return this._query(`/stamp/${stamp.rewardId}`);
                })
                .then(response => {
                    event.stamp = response
                    return this._query(`/event/badge/${event.eventId}`);
                })
                .then(response => {
                    event.badge = response;
                    return this._query(`/degree`);
                })
                .then(response => {
                    var evDegId = event.rankingRewards.filter(reward => reward.rewardType === "degree").map(degree => degree.rewardId);
                    response.forEach(degree => {
                        if (evDegId.includes(degree.degreeId)) {
                            var index = event.rankingRewards.findIndex(reward => reward.rewardId === degree.degreeId);
                            event.rankingRewards[index].degree = degree;
                        }
                    });
                    resolve(event);
                })
                .catch(reject)
        });
    }

    /**
     * Gets all in game bands.
     *
     * @returns {Object.<Number, Object>} Band data map
     * @memberof Bandori
     */
    getBands() {
        return new Promise((resolve, reject) => 
            this._query('/band')
                .then(response => {
                    var bandMap = new Map();
                    response.forEach(band => {
                        bandMap.set(band.bandId, band);
                    });
                    resolve(bandMap);
                })
                .catch(reject)
        )
    }

    /**
     * Gets all main characters.
     *
     * @param {Number} id
     * @returns {Object.<Number, Object>} Character data map
     * @memberof Bandori
     */
    getCharacters() {
        return new Promise((resolve, reject) => 
            this._query(`/chara/band`)
                .then(response => {
                    var charaMap = new Map();
                    response.forEach(chara => {
                        charaMap.set(chara.characterId, chara);
                    });
                    resolve(charaMap);
                })
                .catch(reject)
        )
    }

    /**
     * Gets more detailed character data.
     *
     * @param {Number} id
     * @returns {Object} Character object
     * @memberof Bandori
     */
    getCharacterByID(id) {
        return new Promise((resolve, reject) => {
            var chara;
            return this._query(`/chara/${id}`)
                .then(response => {
                    //resolve(response);
                    chara = response;
                    return this._query(`/live2d/chara/${id}`);
                })
                .then(response => {
                    chara.voices = response.voices;
                    chara.costumes = response.costums;
                    resolve(chara);
                })
                .catch(reject)
        }); 
    }

    /**
     * Gets the in game character costume.
     *
     * @param {Number} id
     * @returns {Object} Live2D Model Setting
     * @memberof Bandori
     */
    getCostumeByID(id) {
        return new Promise((resolve, reject) =>
            this._query(`/chara/${id}`)
                .then(response => {
                    return this._query(`/live2d/model/${id}`);
                })
                .catch(reject)
        );
    }

    /**
     * Gets all in game gachas
     *
     * @returns {Object.<Number, Object>} Gacha data map
     * @memberof Bandori
     */
    getGachas() {
        return new Promise((resolve, reject) =>
            this._query(`/gacha`)
                .then(response => {
                    var gachaMap = new Map();
                    response.data.forEach(gacha => {
                        gachaMap.set(gacha.gachaId, gacha);
                    });
                    resolve(gachaMap);
                })
                .catch(reject)
        );
    }

    /**
     * Gets current active in game gachas
     *
     * @returns {Object.<Number, Object>} Gacha data map
     * @memberof Bandori
     */
    getActiveGachas() {
        return new Promise((resolve, reject) =>
            this._query(`/gacha/current`)
                .then(response => {
                    var gachaMap = new Map();
                    response.data.forEach(gacha => {
                        gachaMap.set(gacha.gachaId, gacha);
                    });
                    resolve(gachaMap);
                })
                .catch(reject)
        );
    }

    /**
     * Gets more detailed gacha data.
     *
     * @param {Number} id
     * @returns {Object} Gacha object
     * @memberof Bandori
     */
    getGachaByID(id) {
        return new Promise((resolve, reject) => 
            this._query(`/gacha/${id}`)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        )
    }

    /**
     * Gets in game story data
     *
     * @param {String} name
     * @returns {Object} Scenario object
     * @memberof Bandori
     */
    getStoryByName(name) {
        return new Promise((resolve, reject) => 
            this._query(`/chara/${name}`)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        )
    }

    /**
     * Get all in game comic data.
     *
     * @returns {Object.<Number, Object>} Comics data map
     * @memberof Bandori
     */
    getComics() {
        return new Promise((resolve, reject) => 
            this._query("/sfc")
                .then(response => {
                    var comicMap = new Map();
                    response.data.forEach(comic => {
                        comicMap.set(comic.singleFrameCartoonId, comic);
                    });
                    resolve(comicMap);
                })
                .catch(reject)
        );
    }

    /**
     * Gets more detailed comic data.
     *
     * @param {Number} id
     * @returns {Object} Comic object
     * @memberof Bandori
     */
    getComicByID(id) {
        return new Promise((resolve, reject) => 
            this._query(`/sfc/${id}`)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        );
    }

    /**
     * Gets game data version.
     *
     * @returns {String} Version
     * @memberof Bandori
     */
    getDataVersion() {
        return new Promise((resolve, reject) => 
            this._query(`/version/res`)
                .then(response => {
                    resolve(response);
                })
                .catch(reject)
        )
    }

    /**
     * Gets the entire game data.
     *
     * @returns {Object} Game data object
     * @memberof Bandori
     */
    getData() {
        return new Promise((resolve, reject) => {
            if (!this.region)
                reject(new Error('Region is not set'));
            request.get(`${this.resourceUrl}/static/MasterDB_${this.region}.json`)
                .set('User-Agent', 'node-dori')
                .end((error, response) => {
                    if (!error && response.status === 200)
                        resolve(response.body);
                    else
                        reject(new Error(error));
                })
        });
    }
}

module.exports = Bandori;