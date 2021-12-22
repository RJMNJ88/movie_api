const mongoose = require('mongoose');
const { stringify } = require('uuid');
const bcrypt = require('bcrypt');

//Define schemas
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movies'}]
});

//Password Hashing
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

let genreSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Description: {type: String, required: true}
});

let directorSchema = mongoose.Schema({
    Name: {type: String, required: true},
    Bio: {type: String, required: true},
    PopularFilms: [String],
    Born: Date,
    Died: Date
});


let Movies = mongoose.model('Movies', movieSchema);
let Users = mongoose.model('Users', userSchema);
let Genres = mongoose.model('Genres', genreSchema);
let Directors = mongoose.model('Directors', directorSchema);

//Export modules
module.exports.Movies = Movies;
module.exports.Users = Users;
module.exports.Genres = Genres;
module.exports.Directors = Directors;



