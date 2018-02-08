const request = require('sync-request');

const Card = require('./models/Card.js');
const Music = require('./models/Music.js');
const Stamp = require('./models/Stamp.js');
const Chart = require('./models/Chart.js');


function loadData(url) {
    return JSON.parse(request('GET', url).getBody().toString());
}

function loadCardData(id, region) {
    var data = loadData(`https://api.bangdream.ga/v1/${region}/card`).data;
    var search = { "cardId": id };

    var res = data.filter(o => {
        return Object.keys(search).every(k => {
            return o[k] == search[k];
        });
    });

    return new Card(res[0]);
}

function loadMusicData(id, region) {
    var data = loadData(`https://api.bangdream.ga/v1/${region}/music`).data;
    var search = { "musicId": id };

    var res = data.filter(o => {
        return Object.keys(search).every(k => {
            return o[k] == search[k];
        });
    });

    return new Music(res[0]);
}

function loadStampData(id, region) {
    var data = module.exports.loadData(`https://api.bangdream.ga/v1/${region}/stamp`).data;
    var search = { "stampId": id };

    var res = data.filter(o => {
        return Object.keys(search).every(k => {
            return o[k] == search[k];
        });
    });

    return new Stamp(res[0]);
}

function loadChartData(id, diff, region) {
    var data = module.exports.loadData(`https://api.bangdream.ga/v1/${region}/music/chart/${id}/${diff}`);
    return new Chart(data);
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

exports.loadData = loadData;
exports.loadCardData = loadCardData;
exports.loadMusicData = loadMusicData;
exports.loadChartData = loadChartData;
exports.loadStampData = loadStampData;

exports.getState = getState;