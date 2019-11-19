const server = require('./app')

function encrypt(text, crypto) {
    var cipher = crypto.createCipher('aes-256-ctr', 'password')
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return cryptedVar = crypted
}

exports.loginUser = (req, res) => {
    const db = server.db
    const bcrypt = server.bcrypt
    const crypto = server.crypto
    const {
        email, password
    } = req.body;

    if (email.length < 3 || password.length < 6) {
        return res.json('Write proper credentials')
    }
    db.select('email', 'hash').from('login').where('email', '=', email).then(data => {
        const validation = bcrypt.compareSync(password, data[0].hash);
        if (validation) {
            db.select('*').from('users').where('email', '=', email).then(data => {

                db.select('*').from('login').where('email', '=', email).then(user => {
                    const dataToEncrypt = `${user[0].email},${user[0].hash}`
                    const encryptedUserData = encrypt(dataToEncrypt, crypto)
                    db.select('*').from('users').where('email', '=', email).then(resp => {
                        // res.status(200).json({
                        //     message: 'Success',
                        //     user: user[0].email,
                        //     token: encryptedUserData,
                        // })
                        res.status(200).json('Success')
                    })
                })

            })
        } else {
            res.status(200).json('Wrong Email or Password')
        }
    }).catch(err => res.status(400).json('wrong password'))
}