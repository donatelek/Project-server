const server = require('../app');
function encrypt(text, crypto) {
    var cipher = crypto.createCipher('aes-256-ctr', 'password')
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return cryptedVar = crypted
}
exports.registerUser = (req, res) => {
    const {
        email,
        password
    } = req.body;
    if (email.length < 3 || password < 6) {
        res.json('Your password should be at least 6 characters')
    } else {
        const db = server.db
        const bcrypt = server.bcrypt
        const crypto = server.crypto
        db.select('*').from('users').where('email', '=', email).then(data => {
            if (data.length) {
                res.json('user exist')
            } else {
                const hash = bcrypt.hashSync(password);
                db.transaction(trx => {
                    trx.insert({
                        hash,
                        email
                    }).into('login').returning('email').then(loginUsername => {
                        return trx('users').returning('*').insert({
                            email: loginUsername[0],
                            joined: new Date(),
                        }).then(user => {
                            const dataToEncrypt = `${user[0].email},${hash}`
                            const encryptedUserData = encrypt(dataToEncrypt, crypto)
                            // res.json({
                            //     status: 'success',
                            //     user: user[0].email,
                            //     token: encryptedUserData
                            // })
                            res.json('Registered')
                        })
                    }).then(trx.commit).catch(trx.rollback)
                }).catch(err => res.status(200).json('User already exist'))
            }
        })
    }
}
