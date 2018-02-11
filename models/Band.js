class Band {
    constructor(data) {
        this.id = data.bandId;
        this.name = data.bandName;
        this.type = data.bandType;
        this.resourceId = data.resourceId;
        this.introductions = data.introductions;
        this.color = data.color;
        this.members = {
            leader: data.leader,
            first: data.member1,
            second: data.member2,
            third: data.member3,
            fourth: data.member4
        };
    }
}

module.exports = Band;