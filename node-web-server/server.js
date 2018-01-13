const express = require( 'express' )
const hbs = require('hbs')
// creates basic web server app
var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')
app.use(express.static(__dirname+'/public'))
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear())
hbs.registerHelper('screamIt', (text) => text.toUpperCase())

// route that returns JSON response and sets content-type header accordingly
app.get( '/', ( req, res ) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: "Welcome!"
    })
} );

app.get( '/about', ( req, res ) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    })
} );

app.get( '/bad', ( req, res ) => {
    res.send( {
        errorMessage: 'Unable to fulfil the request'
    } )
} );

// listening on port 3000 (localhost:3000)
app.listen( 3000, () => {
    console.log('Server is up and listening on port 3000');
} );
