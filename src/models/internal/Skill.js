class Skill {
    constructor(data, region) {
        this.id = data.skillId;
        this.name = data.skillName;
        this.details = mapSkillDetail(data.skillDetail);
    }
}

function mapSkillDetail(skillDetail) {
    var SKILL_MAP = [];
    for (var k in skillDetail) {
        var SKILL = skillDetail[k];
        SKILL_MAP[SKILL.skillLevel] = SKILL.simpleDescription;
    }
    return SKILL_MAP;
};

module.exports = Skill;