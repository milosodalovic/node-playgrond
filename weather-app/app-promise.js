const yargs = require( 'yargs' )
const axios = require( 'axios' )

const argv = yargs.options( {
    a: {
        describe: "Address to fetch the weather for",
        demand: true,
        alias: "address",
        string: true
    }
} ).help().alias( 'help', 'h' ).argv;

const encodedAddress = encodeURIComponent( argv.address )
const geocodeURL     = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get( geocodeURL ).then( ( result ) => {
    if ( result.data.status === "ZERO_RESULTS" ) {
        throw new Error( 'Unable to find that address' )
    }
    const lat           = result.data.results[ 0 ].geometry.location.lat
    const lng           = result.data.results[ 0 ].geometry.location.lng
    const weatherApiUrl = `https://api.darksky.net/forecast/0f7553c3884c42472c483a27fdb79909/${lat},${lng}`

    console.log( result.data.results[ 0 ].formatted_address );

    return axios.get( weatherApiUrl );

} ).then( result => {
    if ( result.status !== 200 ) {
        throw new Error( 'Unable to fetch weather.' )
    }
    const temperature         = result.data.currently.temperature
    const apparentTemperature = result.data.currently.apparentTemperature
    console.log( `It's currently ${temperature}. It feels like ${apparentTemperature}` );

} ).catch( error => {
    if ( error.code === "ECONNREFUSED" ) {
        console.log( 'Unable to connect Google servers' );
    }
    else {
        console.log( error );
    }
} );
