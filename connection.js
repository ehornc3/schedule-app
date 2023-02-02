const mysql = require('mysql')
const credentials = require('./.db.js')
const util = require("util");
const connection = mysql.createConnection(credentials)
connection.connect()
connection.query = util.promisify(connection.query)

module.exports = connection