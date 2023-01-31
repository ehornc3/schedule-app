const express = require('express');
const router = express.Router();
const createError = require('http-errors')
const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'schedule'
})
connection.connect()
connection.query("SELECT \"Established connection to database\" AS result", (err, rows, field) => {
    if (err) throw err
    console.log(rows[0].result)
})
router.use("/auth", (req, res) => {
    res.send({
        token: 'test123'
    })
})
router.post("/schedulegroup", (req, res) => {
    req.get("name")
})

router.use(function(req, res, next) {
    next(createError(404))
})

console.log("API Initialized")

module.exports = router