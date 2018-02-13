class Live2DModel {
    constructor(data, region) {
        this.type = data.type;
        this.name = data.name;
        this.region = region;
        this.model = "https://bangdream.ga/" + data.model;
        this.textures = data.textures.map(texture => "https://bangdream.ga/" + texture);
        this.physics = "https://bangdream.ga/" + data.physics;
        this.expressions = mapExpressions(data.expressions);
        this.motions = mapMotions(data.motions);
    }
}

function mapExpressions(expressions) {
    return expressions.map(exp => {
        return {
            name: exp.name,
            file: "https://bangdream.ga/" + exp.file
        };
    });
}

function mapMotions(motions) {
    for (var prop in motions) {
        if (motions.hasOwnProperty(prop)) {
            motions[prop].map(mtn => {
                return {
                    file: "https://bangdream.ga/" + mtn.file,
                    fade_in: mtn.fade_in,
                    fade_out: mtn.fade_out
                };
            });
        };
    };
}

module.exports = Live2DModel;