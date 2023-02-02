const connection = require('./connection.js')

module.exports.check = async (token) => {
    await connection.query("SELECT token, email FROM user WHERE token = ?", token, (err, rows, fields) => {
        if (err) throw err
        if (rows.length > 0) {
            return rows[0].email
        } else return null
    })
}

/**
 * token.get(email)
 * Paramaters: email that is in the database
 * Returns: a randomized token, which has been put in the database
 */

module.exports.get = async (email, callback) => {
    require('crypto').randomBytes(48, async (err, buffer) => {
        let token = buffer.toString('hex')
        await connection.query("UPDATE user SET token = ?, tokenExpiration = ? WHERE email = ?", [token, new Date(Date.now() + 30*60*1000).toISOString().slice(0, 19).replace('T', ' '), email], (err, rows, fields) => {
            if (err) throw err
            callback(token)
        })
    })
}