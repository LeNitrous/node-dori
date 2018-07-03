class Degree {
    constructor(data) {
        this.id = data.degreeId;
        this.name = data.degreeName;
        this.description = data.description;
        this.type = data.degreeType;
        this.rank = data.degreeRank;
        this.icon = data.imageName;
        this.icon_name = data.iconImageName;
    }
}

module.exports = Degree;