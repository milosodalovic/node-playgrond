const express = require('express')

const app = express();

app.get('/', (req, res)  => {
    res.status(404).send({
        error: "Page not found.",
        name: "Todo app v1.0"
    })
})

app.get('/users', (req, res) => {
    res.send([
        { name: "Milos", age: 30} ,
        { name: "Marko", age: 25}
    ])
})

app.listen(3000, () => {
    console.log('Server\'s listening on port 3000');
})

module.exports.app = app;