const request = require( 'request' );

const geocodeAddress = ( address , callback ) => {

    const encodedAddress = encodeURIComponent( address )

    request( {
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
            json: true
        },
        ( error, response, body ) => {
            if ( error ) {
                callback( 'Unable to connect Google servers' );
            }
            else if ( body.status === "ZERO_RESULTS" ) {
                callback( "Address not found" );
            }
            else if ( body.status === "OVER_QUERY_LIMIT" ) {
                callback( "Query limit hit - not possible to process request" );
            }
            else if ( body.status === "OK" ) {
                // console.log( JSON.stringify(body, undefined, 2) );
                callback(undefined, {
                    address: body.results[ 0 ].formatted_address,
                    latitude: body.results[ 0 ].geometry.location.lat,
                    longitude: body.results[ 0 ].geometry.location.lng
                });
            }
        } )
}
module.exports       = {
    geocodeAddress
}