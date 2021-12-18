const { response } = require('express');

const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    Movies = Models.Movies,
    Users = Models.Users,
    Genres = Models.Genres,
    Directors = Models.Directors;

const app = express();
const { check, validationResult } = require('express-validator');

//Connect to my database
mongoose.connect('mongodb://localhost:27017/[myFilmDB]', { useNewUrlParser: true, useUnifiedTopology: true });

//Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Express
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//CORs
const cors = require('cors');
app.use(cors());

//Auth.js
let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport.js');

//Log requests using Morgan
app.use(morgan('common'));

//App Requests Using Mongoose and MongoDB

//Default response
app.get('/', (req, res) => {
    res.send('Welcome to myFilmDB !');
});

//Add a new user
app.post('/users',   
    [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Password', 'Password must be 8 characters long').isLength({min: 8}),
        check('email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {

    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = users.hashPassword(req.body.Password);
    Users.findOne({Username: req.body.Username})
    .then((user) => {
        if(user) {
            return res.status(400).send(req.body.Username + ' already exists');
        } else {
            Users
            .create({
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user) => {res.status(201).json(user)})
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error + '.');
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error + '.');
    });
});

//Get a list of all users
app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Get a list of all movies
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


//Get a user by username
app.get('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOne({Username: req.params.Username})
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Get a movie by title
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({Title: req.params.Title})
    .then((movieTitle) => {
        res.json(movieTitle);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Update a user's info (by username)
app.put('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, { $set: 
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    {new: true},
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//Add a movie to a user's list of favorite movies
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, {
        $push: {FavoriteMovies: req.params.MovieID}
    },
    {new: true},
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//Delete a movie from a user's list of favorite movies
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndUpdate({Username: req.params.Username}, {
        $pull: {FavoriteMovies: req.params.MovieID}
    },
    {new: true},
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

//Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOne({Username: req.params.Username})
    .then((user) => {
        if(!user) {
            res.status(400).send(req.params.Username + ' was not found.');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Get a list of genres
app.get('/genres', passport.authenticate('jwt', {session: false}), (req, res) => {
    Genres.find()
    .then((genres) => {
        res.status(201).json(genres);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Find a genre by name
app.get('/genres/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
    Genres.findOne({Name: req.params.Name})
    .then((genre) => {
        res.json(genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Get a list of directors
app.get('/directors', passport.authenticate('jwt', {session: false}), (req, res) => {
    Directors.find()
    .then((directors) => {
        res.status(201).json(directors);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Find a director by name
app.get('/directors/:Name', passport.authenticate('jwt', {session: false}), (req, res) => {
    Directors.findOne({Name: req.params.Name})
    .then((genre) => {
        res.json(genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});



//Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});










/*
//In-memory movie list
let movies = [
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        genre: ['Fantasy'],
        released: 2001 ,
        director: 
            {
                name: 'Peter Jackson',
                born: 'October 31, 1961',
                country: 'New Zealand'
            }
    },
    {
        title: 'The Hobbit: An Unexpected Journey',
        genre: ['Fantasy'],
        released: 2012,
        director: 
            {
                name: 'Peter Jackson',
                born: 'October 31, 1961',
                country: 'New Zealand'
            }
    },
    {
        title: 'The Girl with the Dragon Tattoo',
        genre: ['Thriller'],
        released: 2011,
        director: 
            {
                name: 'David Fincher',
                born: 'August 28, 1962',
                country: 'USA'
            }
    },
    {
        title: 'Layer Cake',
        genre: ['Crime', 'Thriller'],
        released: 2005,
        director: 
            {
                name: 'Matthew Vaughn',
                born: 'March 7, 1971',
                country: 'England'
            }
    },
    {
        title: 'Lock, Stock, and Two Smoking Barrels',
        genre: ['Crime', 'Thriller'],
        released: 1999,
        director: 
            {
                name: 'Guy Ritchie',
                born: 'September 10, 1968',
                country: 'England'
            }
    },
    {
        title: 'Angela\'s Ashes',
        genre: ['Drama'],
        released: 1999,
        director: 
            {
                name: 'Alan Parker',
                born: 'February 14, 1944',
                country: 'England'
            }
    },
    {
        title: 'Casino Royale',
        genre: ['Action', 'Thriller'],
        released: 2006,
        director: 
            {
                name: 'Martin Campbell',
                born: 'October 24, 1943',
                country: 'New Zealand'
            }
    },
    {
        title: 'The Best Exotic Marigold Hotel',
        genre: ['Drama'],
        released: 2012,
        director: 
            {
                name: 'John Madden',
                born: 'April 8, 1949',
                country: 'England'
            }
    },
    {
        title: 'Like Father, Like Son',
        genre: ['Drama'],
        released: 2014,
        director: 
            {
                name: 'Hirokazu Koreeda',
                born: 'June 6, 1962',
                country: 'Japan'
            }
    },
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        genre: ['Fantasy'],
        released: 2001,
        director: 
            {
                name: 'Chris Columbus',
                born: 'September 10, 1958',
                country: 'USA'
            }
    }
];
*/




//Old GET Requests

/*
//Allow new users to register
app.post('/users', (req, res) => {
    res.send('Your account has been succesfully registered.');
});

//Allow users to update user info
app.put('/users/:userinfo', (req, res) => {
    res.send('User info has been successfully updated.');
});

//Allow users to add a movie to their list of favorites
app.post('/users/:userinfo/movies/:title', (req, res) => {
    res.send('New movie has been added to your list of favorites.');
});

//Allow users to remove a movie from their list of favorites
app.delete('/users/:userinfo/movies/:title', (req, res) => {
    res.send('Movie has been deleted from your list of favorites.');
});

//Gets the list of data about all movies
app.get('/movies', (req, res) => {
    res.send('Here is the list of films you requested.');
});

//Return data: description, genre, director, image URL
app.get('/movies/:title', (req, res) => {
    res.send('Here is the description of the film you searched for.');
});

//Return data about genres
app.get('/genre', (req, res) => {
    res.send('Here is a list of films matching that genre.');
});

//Return data about a genre by searching a genre-type
app.get('/genre/:name', (req, res) => {
    res.send('Here is a list of films matching that genre.');
});

//Return data about directors
app.get('/director', (req, res) => {
    res.send('Here is a list of films from that director.');
});

//Return data about a director by name
app.get('/director/:name', (req, res) => {
    res.send('Here is a list of films from that director.');
});









*/