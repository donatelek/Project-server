const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const crypto = require('crypto');
// const rp = require('request-promise');
const cheerio = require('cheerio');


const {
    loginUser
} = require('./Routes/Login')

const {
    registerUser
} = require('./Routes/Register')

const db = require('knex')({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});

// const db = require('knex')({
//     client: 'pg',
//     connection: {
//         host: '127.0.0.1',
//         user: 'postgres',
//         password: 'password',
//         database: 'Projectx'
//     }
// });




const app = express();
// exports;
exports.db = db;
exports.crypto = crypto;
exports.bcrypt = bcrypt;
exports.app = app;

app.use(cors())
app.use(bodyParser.json());
app.set('x-powered-by', false)

app.get('/', (req, res) => {
    res.send('App is running')
})
app.post('/register', registerUser)
app.post('/login', loginUser)


app.get('*', (req, res) => {
    respondNotFound(res)
})
app.use((err, req, res, next) => {
    res.status(500)
    res.send('We have encountered an error. We will try to fix it as soon as possible')
})
const port = process.env.PORT || 3005
app.listen(port, () => {
    console.log(`We are on port ${port} `)
})