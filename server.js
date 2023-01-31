const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const logger = require('morgan')
const subdomain = require('express-subdomain')

const api = require('./api.js')
const {urlencoded} = require("express");

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(urlencoded({extended: false}))

app.use('/api', api)

app.use(express.static(path.join(__dirname, 'build')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + "/build/index.html"))
})

app.use(function(err, req, res, next) {
    res.locals.message = err.statusMessage
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    res.status(err.status || 500)
    res.render('error')
})

app.listen(8080)