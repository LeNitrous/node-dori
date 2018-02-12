class LocaleCharacter {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.image = data.image;
        this.area_icon = data.square_image;
        this.band = data.i_band;
        this.school = data.school;
        this.school_year = data.school_year;
        this.voice = {
            romaji: data.romaji_CV,
            local: data.CV
        }
        this.birthday = data.birthday,
        this.food = {
            like: data.food_likes,
            dislike: data.food_dislikes
        }
        this.constellation = data.i_astrological_sign;
        this.hobbies = data.hobbies;
        this.description = data.description;
    }
}

module.exports = LocaleCharacter;