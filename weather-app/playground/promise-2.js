const request = require( 'request' );

const geocodeAddress = ( address ) => {
    const encodedAddress = encodeURIComponent( address )

    return new Promise( ( resolve, reject ) => {
        request( {
                url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
                json: true
            },
            ( error, response, body ) => {
                if ( error ) {
                    reject( 'Unable to connect Google servers' );
                }
                else if ( body.status === "ZERO_RESULTS" ) {
                    reject( "Address not found" );
                }
                else if ( body.status === "OVER_QUERY_LIMIT" ) {
                    reject( "Query limit hit - not possible to process request" );
                }
                else if ( body.status === "OK" ) {
                    // console.log( JSON.stringify(body, undefined, 2) );
                    resolve( {
                        address: body.results[ 0 ].formatted_address,
                        latitude: body.results[ 0 ].geometry.location.lat,
                        longitude: body.results[ 0 ].geometry.location.lng
                    } );
                }
            } )
    } )

}

geocodeAddress( '19146' ).then( location => {
    console.log( JSON.stringify( location, undefined, 2 ) )
}, errorMessage => {
    console.log( errorMessage );
} )