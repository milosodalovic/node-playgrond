const yargs = require( 'yargs' )

const geocode = require( './geocode/geocode' )
const weather = require( './weather/weather' )

const argv = yargs.options( {
    a: {
        describe: "Address to fetch the weather for",
        demand: true,
        alias: "address",
        string: true
    }
} ).help().alias( 'help', 'h' ).argv;

geocode.geocodeAddress( argv.a, ( errorMessage, result ) => {
    if ( errorMessage ) {
        console.log( errorMessage );
    }
    else {
        console.log(result.address);
        weather.getWeather(result.latitude, result.longitude, (errorMessage, weatherResult)=>{
            if(errorMessage){
                console.log(errorMessage);
            } else {
                console.log(`It's currently ${weatherResult.temperature}. It feels like ${weatherResult.apparentTemperature}`);
            }
        })
    }
} )

