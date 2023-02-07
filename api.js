const express = require('express');
const router = express.Router();
const createError = require('http-errors')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const connection = require('./connection.js')
const token = require('./token.js')

router.use("/auth/signup", async (req, res) => {
    console.log(req.body)
    try {
        await bcrypt.hash(req.body.password, 10,  async (err, hash) => {
            if (err) throw err
            await connection.query("INSERT INTO user (`email`,`password`,`name`) VALUES (?, ?, ?)", [req.body.email, hash, req.body.name], async (err, rows, fields) => {
                if (err) throw err
                await token.get(req.body.email, (tkn) => {
                    res.send({status: "success", token: tkn})
                })
            })
        })

    } catch(e) {
        console.log(e)
        createError(500)
    }
})
router.use("/auth/login", async (req, res) => {
    try {
        await connection.query("SELECT password FROM user WHERE email = ?", req.body.email, async (err, rows, fields) => {
            if (err) throw err
            if (rows.length == 0) {
                res.send({status: "failure", description: "Email not found"})
            } else await bcrypt.compare(req.body.password, rows[0].password, async (err, result) => {
                if (err) throw err
                if (result) {
                    await token.get(req.body.email, (result) => {
                        res.send({status: "success", token: result})
                    })
                } else res.send({status: "failure", description: "Password does not match"})
            })
        })
    } catch(e) {
        console.log(e)
        createError(500)
    }
})

router.post("/schedulegroup", (req, res) => {
    res.send(req.get("name"))
})

router.use(function(req, res, next) {
    next(createError(404))
})

console.log("API Installed")

module.exports = router