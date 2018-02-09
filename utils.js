const request = require('superagent');

const Card = require('./models/Card.js');
const Music = require('./models/Music.js');
const Stamp = require('./models/Stamp.js');
const Chart = require('./models/Chart.js');

class ConnectionError extends Error {
    constructor(status, response) {
        super();
        this.name = "ConnectionError";
        this.status = status;
        this.message = `Error ${status}: Server Replied with ${response}`;
    }
}

class EmptyResponseError extends Error {
    constructor() {
        super();
        this.name = "EmptyResponseError";
        this.message = "No response was found or response was empty";
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
                else
                    reject(new ConnectionError(error.status, error.response));
            });
    });
}

function loadCardData(id, region) {
    return new Promise((resolve, reject) => {
        loadData(`https://api.bangdream.ga/v1/${region}/card/${id}`)
            .then(response => {
                resolve(new Card(response, region));
            })
            .catch(error => {
                if (error instanceof ConnectionError)
                    if (error.status == 400) reject(new EmptyResponseError());
                reject(error);
            });
    });
}

function loadMusicData(id, region) {
    return new Promise((resolve, reject) => {
        loadData(`https://api.bangdream.ga/v1/${region}/music/${id}`)
            .then(response => {
                resolve(new Music(response, this.region));
            })
            .catch(error => {
                if (error instanceof ConnectionError)
                    if (error.status == 400) reject(new EmptyResponseError());
                reject(error);
            });
    });
}

function loadChartData(id, diff, region) {
    return new Promise((resolve, reject) => {
        loadData(`https://api.bangdream.ga/v1/${region}/music/chart/${id}/${diff}`)
            .then(response => {
                resolve(new Chart(response, diff));
            })
            .catch(error => {
                if (error.status == 400) reject(new EmptyResponseError());
                reject(error);
            });
    });
}

function loadStampData(id, region) {
    return new Promise((resolve, reject) => {
        loadData(`https://api.bangdream.ga/v1/${region}/stamp/${id}`)
            .then(response => {
                resolve(new Stamp(response));
            })
            .catch(error => {
                if (error instanceof ConnectionError)
                    if (error.status == 400) reject(new EmptyResponseError());
                reject(error);
            });
    });
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

module.exports.ConnectionError =  ConnectionError;
module.exports.EmptyResponseError =  EmptyResponseError;
module.exports.InvalidParameterError =  InvalidParameterError;
module.exports.loadData =  loadData;
module.exports.loadCardData =  loadCardData;
module.exports.loadChartData =  loadChartData;
module.exports.loadMusicData =  loadMusicData;
module.exports.loadStampData =  loadStampData;