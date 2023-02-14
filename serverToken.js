const connection = require('./connection.js')

module.exports.check = async (token, requiredPermission, callback) => {
    await connection.query("SELECT token, email, permission, tokenExpiration FROM user WHERE token = ?", token, (err, rows, fields) => {
        if (err) throw err
        // Check the token is in the database. If not, return null. If so, check it is not expired. If not, check permissions...
        if (rows.length > 0 && Date.parse(rows[0].tokenExpiration) > Date.parse(new Date(Date.now()).toISOString())) {
            if (requiredPermission == "admin") {
                switch(rows[0].permission) {
                    case "admin":
                        callback(rows[0].email)
                        break;
                    default:
                        callback(null)
                }
            } else if (requiredPermission == "user") {
                switch(rows[0].permission) {
                    case "admin":
                    case "user":
                        callback(rows[0].email)
                        break;
                    default:
                        callback(null)

                }
            } else if (requiredPermission == "none") {
                callback(rows[0].email)
            }
        } else callback(null)
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