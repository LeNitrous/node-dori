module.exports = {
    findProp(val, obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (obj[prop] == val)
                return prop;
            }
        }
    },
    
    loadData(endpoint) {
        return JSON.parse(requestSync('GET', endpoint).getBody().toString());
    }
}