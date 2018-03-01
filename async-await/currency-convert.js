const axios = require('axios');

const getExchangeRate = async (from, to) => {
    try {
        const response = await axios.get(`https://api.fixer.io/latest?base=${from}`);
        const rate =  response.data.rates[ to ];

        if(rate){
            return rate
        } else {
            throw new Error();
        }
    } catch (e) {
        throw new Error(`Unable to get exchange rate for ${from} and ${to}.`)
    }
};

const getCountries = async (currencyCode) => {

    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
        return response.data.map(country => country.name);
    } catch (e) {
        throw new Error(`Unable to get countries that use ${currencyCode}.`);
    }
};

const convertCurrency = (from, to, amount) => {
    let countries;
    return getCountries(to).then((tempCountries) => {
        countries = tempCountries;
        return getExchangeRate(from, to);
    }).then(rate => {
        return `${amount} ${from} is worth ${ amount*rate} ${to}. You can spend these in the following countries: \n ${countries.join(', ')}`
    })
};

const convertCurrencyAlt = async (from, to, amount) => {
    // const countries = await getCountries(to);
    const rate = await getExchangeRate(from, to);
    //
    // return `${amount} ${from} is worth ${ amount*rate} ${to}. You can spend these in the following countries: \n ${countries.join(', ')}`
};

convertCurrencyAlt('USD', 'fsf', 23).then(countries => {
    console.log(countries);
}).catch(e=>{
    console.log(e.message);
});
