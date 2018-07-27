const request = require('superagent');

const Card = require('./models/Card.js');
const Band = require('./models/Band.js');
const Music = require('./models/Music.js');
const Scenario = require('./models/Scenario.js');
const Character = require('./models/Character.js');

const Stamp = require('./models/internal/Stamp.js');
const Chart = require('./models/internal/Chart.js');
const Skill = require('./models/internal/Skill.js');
const Degree = require('./models/internal/Degree.js');
const Live2DAction = require('./models/internal/Live2DAction');
const Live2DCostume = require('./models/internal/Live2DCostume');
const LocaleCard = require('./models/internal/LocaleCard.js');
const LocaleEvent = require('./models/internal/LocaleEvent.js');
const LocaleCharacter = require('./models/internal/LocaleCharacter.js');

class ConnectionError extends Error {
    constructor(status, response) {
        super();
        this.name = "ConnectionError";
        this.status = status;
        this.message = `Server replied with a status code: ${status}`;
        this.response = response;
    }
}

class InvalidParameterError extends Error {
    constructor() {
        super();
        this.name = "InvalidParameterError";
        this.message = "Invalid parameters recieved";
    }
}

function loadData(url) {
    return new Promise((resolve, reject) => {
        request.get(url)
            .set('User-Agent', 'node-dori')
            .end((error, response) => {
                if (!error && response.status === 200)
                    resolve(response.body);
                else {
                    reject(new ConnectionError(error.status, error.response));
                }
            });
    });
}

function loadCardData(id, api) {
    return new Promise((resolve, reject) => 
        loadData(`${api.apiUrl}/card/${id}`)
            .then(response => {
                resolve(new Card(response, region));
            })
            .catch(reject)
    );
}

function loadMusicData(id, api) {
    return new Promise((resolve, reject) => 
        loadData(`${api.apiUrl}/music/${id}`)
            .then(response => {
                resolve(new Music(response, this));
            })
            .catch(reject)
    );
}

function loadChartData(music, diff) {
    return new Promise((resolve, reject) => 
        loadData(`${api.apiUrl}/music/chart/${music.id}/${diff}`)
            .then(response => {
                resolve(new Chart(response, music, diff));
            })
            .catch(reject)
    );
}

function loadStampData(id, api) {
    return new Promise((resolve, reject) =>
        loadData(`${api.apiUrl}/stamp/${id}`)
            .then(response => {
                resolve(new Stamp(response));
            })
            .catch(reject)
    );
}

function loadCharaData(id) {
    return new Promise((resolve, reject) =>
        loadData(`https://bandori.party/api/cards/${id + 500}`)
            .then(response => {
                resolve(new LocaleCard(response));
            })
            .catch(reject)
    );
}

function loadBandData(id) {
    return new Promise((resolve, reject) =>
        loadData(`${api.apiUrl}/band`)
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
    );
}

function loadCardSkillData(id) {
    return new Promise((resolve, reject) =>
        loadData(`${api.apiUrl}/skill/cardId/${id}`)
            .then(response => {
                resolve(new Skill(response));
            })
            .catch(reject)
    );
}

function loadCardScenarioData(name) {
    return new Promise((resolve, reject) =>
        loadData(`${api.apiUrl}/scenario/chara/${name}`)
            .then(response => {
                resolve(new Scenario(response));
            })
            .catch(reject)
    );
}

function loadLive2DCharacterInfo(id, api) {
    return new Promise((resolve, reject) =>
        loadData(`${api.apiUrl}/live2d/chara/${id}`)
            .then(response => {
                var live2d = {
                    actions: [],
                    costumes: []
                };
                response.voices.forEach(voice => {
                    live2d.actions.push(new Live2DAction(voice, api));
                });
                response.costums.forEach(costume => {
                    live2d.costumes.push(new Live2DCostume(costume, api));
                });
                resolve(live2d);
            })
            .catch(reject)
    );    
}

function loadLive2DModelData(id, api) {
    return new Promise((resolve, reject) =>
        loadData(`${api.apiUrl}/live2d/model/${id}`)
            .then(response => {
                resolve(response);
            })
            .catch(reject)
    );       
}

function loadLocaleCardData(id) {
    return new Promise((resolve, reject) =>
        loadData(`https://bandori.party/api/cards/${id + 500}`)
            .then(response => {
                resolve(new LocaleCard(response));
            })
            .catch(reject)
    );
}

function loadLocaleCharaData(id) {
    return new Promise((resolve, reject) =>
        loadData(`https://bandori.party/api/members/${id + 5}`)
            .then(response => {
                resolve(new LocaleCharacter(response));
            })
            .catch(reject)
    );
}

function loadLocaleEventData(id) {
    return new Promise((resolve, reject) =>
        loadData(`https://bandori.party/api/events/${id}`)
            .then(response => {
                resolve(new LocaleEvent(response));
            })
            .catch(reject)
    );
}

function getState(start, end) {
    var now = new Date();
    if (now < start && now < end)
        return -1;
    else if (now > start && now < end)
        return 0;
    else if (now > start && now > end)
        return 1;
}

module.exports.ConnectionError = ConnectionError;
module.exports.InvalidParameterError = InvalidParameterError;
module.exports.loadData = loadData;
module.exports.loadCardData = loadCardData;
module.exports.loadBandData = loadBandData;
module.exports.loadChartData = loadChartData;
module.exports.loadMusicData = loadMusicData;
module.exports.loadStampData = loadStampData;
module.exports.loadCharaData = loadCharaData;
module.exports.loadCardSkillData = loadCardSkillData;
module.exports.loadCardScenarioData = loadCardScenarioData;
module.exports.loadLive2DModelData = loadLive2DModelData;
module.exports.loadLive2DCharacterInfo = loadLive2DCharacterInfo;
module.exports.loadLocaleCardData = loadLocaleCardData;
module.exports.loadLocaleEventData = loadLocaleEventData;
module.exports.loadLocaleCharaData = loadLocaleCharaData;
module.exports.getState = getState;