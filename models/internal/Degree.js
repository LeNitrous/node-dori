class Degree {
    constructor(data, region) {
        this.id = data.degreeId;
        this.name = data.degreeName;
        this.description = data.description;
        this.type = data.degreeType;
        this.rank = data.degreeRank;
        this.icon = data.imageName;
        this.icon_name = data.iconImageName;
    }
}