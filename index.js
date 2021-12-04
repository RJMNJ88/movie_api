const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');


const app = express();
app.use(bodyParser.json());

//Log requests using Morgan
app.use(morgan('common'));

//Top-ten movie list
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

// GET Requests

//Gets the list of data about all movies
app.get('/movies', (req, res) => {
    res.send('Here is the list of films you requested.');
});

//Return data: description, genre, director, image URL
app.get('/movies/:title', (req, res) => {
    res.send('Here is the description of the film you searched for.');
});

//Return data about a genre by searching a genre-type
app.get('/genre', (req, res) => {
    res.send('Here is a list of films matching that genre.');
});

//Return data about a director by name
app.get('/director', (req, res) => {
    res.send('Here is a list of films from that director.');
});

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

//Allow existing users to de-register
app.delete('/users/:userinfo', (req, res) => {
    res.send('User account has been deleted.');
});


//Listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on Port 8080.');
});




// -------------------- OLD CODE ----------------------- //
/*
//GET requests
app.get('/', (req, res) => {
    res.send('Welcome to my Top-Ten Movies Page !');
});

app.use('/documentation', express.static('public'));

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

//Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong !');
});
*/
