const express = require('express');
const router = express.Router();
const createError = require('http-errors')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const connection = require('./connection.js')
const token = require('./token.js')
const {response} = require("express");

router.post("/auth/signup", async (req, res) => {
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
router.post("/auth/login", async (req, res) => {
    try {
        await connection.query("SELECT password FROM user WHERE email = ?", req.body.email, async (err, rows, fields) => {
            if (err) throw err
            if (rows.length == 0) {
                res.status(400).send({status: "failure", description: "Email not found"})
            } else await bcrypt.compare(req.body.password, rows[0].password, async (err, result) => {
                if (err) throw err
                if (result) {
                    await token.get(req.body.email, (result) => {
                        res.send({status: "success", token: result})
                    })
                } else res.status(400).send({status: "failure", description: "Password does not match"})
            })
        })
    } catch(e) {
        console.log(e)
        createError(500)
    }
})
// POST /users will be used for modifying account permissions.
router.post("/users", async (req, res) => {
    createError(501)
})

// GET /users will generate a list of all accounts, regardless of permissions.
router.get("/users", async (req, res) => {
    console.log('req came in')
    if (!req.body.token) res.status(401).send({status: "failure", description: "No token"})
    await token.check(req.body.token, "admin", async (result) => {
        if (!result) res.status(403).send({status: "failure", description: "Forbidden"})
        else try {
            console.log("trying to return")
            await connection.query("SELECT email, name, permission FROM user", async (err, rows, fields) => {
                if (err) throw err
                console.log("query succeeded")
                res.status(200).send({rows: rows, fields: fields})
            })
        } catch (e) {
            console.log(e)
            createError(500)
        }
    })
})
// DELETE /users will delete a user account.
router.delete("/users", async (req, res) => {
    createError(501)
})

router.use(function(req, res, next) {
    next(createError(404))
})

console.log("API Installed")

module.exports = router