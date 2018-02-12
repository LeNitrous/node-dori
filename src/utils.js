const request = require('superagent');

const Card = require('./models/Card.js');
const Band = require('./models/Band.js');
const Koma = require('./models/Koma.js');
const Music = require('./models/Music.js');
const Scenario = require('./models/Scenario.js');
const Character = require('./models/Character.js');

const Stamp = require('./models/internal/Stamp.js');
const Chart = require('./models/internal/Chart.js');
const Skill = require('./models/internal/Skill.js');
const Degree = require('./models/internal/Degree.js');
const Live2DModel = require('./models/internal/Live2DModel');
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

function loadCardData(id, region) {
    return new Promise((resolve, reject) => 
        loadData(`https://api.bangdream.ga/v1/${region}/card/${id}`)
            .then(response => {
                resolve(new Card(response, region));
            })
            .catch(reject)
    );
}

function loadMusicData(id, region) {
    return new Promise((resolve, reject) => 
        loadData(`https://api.bangdream.ga/v1/${region}/music/${id}`)
            .then(response => {
                resolve(new Music(response, this.region));
            })
            .catch(reject)
    );
}

function loadChartData(id, diff, region) {
    return new Promise((resolve, reject) => 
        loadData(`https://api.bangdream.ga/v1/${region}/music/chart/${id}/${diff}`)
            .then(response => {
                resolve(new Chart(response, diff));
            })
            .catch(reject)
    );
}

function loadStampData(id, region) {
    return new Promise((resolve, reject) =>
        loadData(`https://api.bangdream.ga/v1/${region}/stamp/${id}`)
            .then(response => {
                resolve(new Stamp(response));
            })
            .catch(reject)
    );
}

function loadCharaData(id, region) {
    return new Promise((resolve, reject) =>
        loadData(`https://bandori.party/api/cards/${this.id + 500}`)
            .then(response => {
                resolve(new LocaleCard(response));
            })
            .catch(reject)
    );
}

function loadBandData(id, region) {
    return new Promise((resolve, reject) =>
        loadData(`https://api.bangdream.ga/v1/${region}/band`)
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

function loadCardSkillData(id, region) {
    return new Promise((resolve, reject) =>
        loadData(`https://api.bangdream.ga/v1/${region}/skill/cardId/${id}`)
            .then(response => {
                resolve(new Skill(response, region));
            })
            .catch(reject)
    );
}

function loadCardScenarioData(name, region) {
    return new Promise((resolve, reject) =>
        loadData(`https://api.bangdream.ga/v1/${region}/scenario/chara/${name}`)
            .then(response => {
                resolve(new Scenario(response, region));
            })
            .catch(reject)
    );
}

function loadLive2DCharacterInfo(id, region) {
    return new Promise((resolve, reject) =>
        loadData(`https://api.bangdream.ga/v1/${region}/live2d/chara/${id}`)
            .then(response => {
                var live2d = {
                    actions: [],
                    costumes: []
                };
                response.voices.forEach(voice => {
                    live2d.actions.push(new Live2DAction(voice));
                });
                response.costums.forEach(costume => {
                    live2d.costumes.push(new Live2DCostume(costume));
                });
                resolve(live2d);
            })
            .catch(reject)
    );    
}

function loadLive2DModelData(id, region) {
    return new Promise((resolve, reject) =>
        loadData(`https://api.bangdream.ga/v1/${region}/live2d/chara/${id}`)
            .then(response => {
                resolve(new Live2DModel(response));
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