const Card = require('./models/Card.js');
const Music = require('./models/Music.js');
const Stamp = require('./models/Stamp.js');
const Chart = require('./models/Chart.js');

module.exports = {
    loadData(endpoint) {
        return JSON.parse(requestSync('GET', endpoint).getBody().toString());
    },

    loadCardData(id, region) {
        var card = module.exports.loadData(`https://api.bangdream.ga/v1/${region}/card`).data;
        var search = { "cardId": id };
    
        var res = data.filter(o => {
            return Object.keys(search).every(k => {
                return o[k] == search[k];
            });
        });
    
        return new Card(res[0]);
    },

    loadMusicData(id, region) {
        var data = module.exports.loadData(`https://api.bangdream.ga/v1/${region}/music`).data;
        var search = { "musicId": id };
    
        var res = data.filter(o => {
            return Object.keys(search).every(k => {
                return o[k] == search[k];
            });
        });
    
        return new Music(res[0]);
    },

    loadStampData(id, region) {
        var data = module.exports.loadData(`https://api.bangdream.ga/v1/${region}/stamp`).data;
        var search = { "stampId": id };
    
        var res = data.filter(o => {
            return Object.keys(search).every(k => {
                return o[k] == search[k];
            });
        });
    
        return new Stamp(res[0]);
    },

    loadChartData(id, diff, region) {
        var data = module.exports.loadData(`https://api.bangdream.ga/v1/${region}/music/chart/${id}/${diff}`);
        return new Chart(data);
    },

    formatTimeLeft(date) {
        let time = new Date(date - new Date()).getTime();
    
        let d = Math.floor(time / (1000 * 60 * 60 * 24));
        let h = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let m = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        let s = Math.floor((time % (1000 * 60)) / 1000);
    
        let str = '';
    
        let d_tag = (d == 1) ? 'day' : 'days';
        let h_tag = (h == 1) ? 'hour' : 'hours';
        let m_tag = (m == 1) ? 'minute' : 'minutes';
        let s_tag = (s == 1) ? 'second' : 'seconds';
    
        if (d != 0)
            str = str + `${d} ${d_tag} `;
        if (h != 0)
            str = str + `${h} ${h_tag} `;
        if (m != 0)
            str = str + `${m} ${m_tag} `;
        if (s != 0)
            str = str + `${s} ${s_tag}`;
    
        return str;
    },

    getState(start, end) {
        var now = new Date();
        if (now < start && now < end)
            return -1;
        else if (now > start && now < end)
            return 0;
        else if (now > start && now > end)
            return 1;
    }
}