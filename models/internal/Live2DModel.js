class Live2DModel {
    constructor(data, region) {
        this.type = data.type;
        this.name = data.name;
        this.model = data.model;
        this.textures = data.textures;
        this.physics = data.physics;
        this.expressions = data.expressions;
        this.motions = data.motions;
    }
}

module.exports = Live2DModel;