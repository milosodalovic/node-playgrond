const request    = require( 'request' )

const getWeather = ( lat, lng, callback ) => {

    request( {
        url: `https://api.darksky.net/forecast/0f7553c3884c42472c483a27fdb79909/${lat},${lng}`,
        json: true
    }, ( error, response, body ) => {
        if ( !error && response.statusCode === 200 ) {
            callback(undefined, {
                temperature: Math.round( (body.currently.temperature - 32) / 1.8),
                apparentTemperature: Math.round( (body.currently.apparentTemperature - 32) / 1.8)
            });
        }
        else {
            callback( 'Unable to fetch weather.' );
        }
    } )
}

module.exports.getWeather = getWeather