const express = require('express');
const morgan = require('morgan');


const app = express();

//Log requests using Morgan
app.use(morgan('common'));

//Top-ten movie list
let topMovies = [
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        genre: ['Fantasy'],
        releaseYear: 2001 ,
        director: 'Peter Jackson'
    },
    {
        title: 'The Hobbit: An Unexpected Journey',
        genre: ['Fantasy'],
        releaseYear: 2012,
        director: 'Peter Jackson'
    },
    {
        title: 'The Girl with the Dragon Tattoo',
        genre: ['Thriller'],
        releaseYear: 2011,
        director: 'David Fincher'
    },
    {
        title: 'Layer Cake',
        genre: ['Crime', 'Thriller'],
        releaseYear: 2005,
        director: 'Matthew Vaughn'
    },
    {
        title: 'Lock, Stock, and Two Smoking Barrels',
        genre: ['Crime', 'Thriller'],
        releaseYear: 1999,
        director: 'Guy Ritchie'
    },
    {
        title: 'Angela\'s Ashes',
        genre: ['Drama'],
        releaseYear: 1999,
        director: 'Alan Parker'
    },
    {
        title: 'Casino Royale',
        genre: ['Action', 'Thriller'],
        releaseYear: 2006,
        director: 'Martin Campbell'
    },
    {
        title: 'The Best Exotic Marigold Hotel',
        genre: ['Drama'],
        releaseYear: 2012,
        director: 'John Madden'
    },
    {
        title: 'Like Father, Like Son',
        genre: ['Drama'],
        releaseYear: 2014,
        director: 'Hirokazu Koreeda'
    },
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        genre: ['Fantasy'],
        releaseYear: 2001,
        director: 'Chris Columbus'
    }
];

//GET requests
app.get('/', (req, res) => {
    res.send('Welcome to my Top-Ten Movies Page !');
});

app.use('/documentation', express.static('public'));

// app.get('/documentation', (req, res) => {
//     res.sendFile('public/documentation.html', {root:__dirname});
// });

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

//Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong !');
});

//Listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on Port 8080.');
});