const express = require('express');
const router = express.Router();
const createError = require('http-errors')
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const connection = require('./connection.js')
const token = require('./serverToken.js')
const {response} = require("express");

/** POST /auth/signup
 * Used to create a new account.
 * Requires: {email, password, name}
 * Response: {token}
 */
router.post("/auth/signup", async (req, res) => {
    try {
        await bcrypt.hash(req.body.password, 10,  async (err, hash) => {
            if (err) throw err
            await connection.query("INSERT INTO user (`email`,`password`,`name`) VALUES (?, ?, ?)", [req.body.email, hash, req.body.name], async (err, rows, fields) => {
                if (err) throw err
                await token.get(req.body.email, (tkn) => {
                    res.send({status: "success", token: tkn, name: req.body.name})
                })
            })
        })

    } catch(e) {
        console.log(e)
        createError(500)
    }
})

/** POST /auth/login
 * Checks if a password matches, and returns a new token if so.
 * Requires: {email, password}
 * Response: {token}
 */
router.post("/auth/login", async (req, res) => {
    try {
        await connection.query("SELECT password, name FROM user WHERE email = ?", req.body.email, async (err, rows, fields) => {
            if (err) throw err
            if (rows.length == 0) {
                res.status(400).send({status: "failure", description: "Email not found"})
            } else await bcrypt.compare(req.body.password, rows[0].password, async (err, result) => {
                if (err) throw err
                if (result) {
                    await token.get(req.body.email, (result) => {
                        res.send({status: "success", token: result, name: rows[0].name})
                    })
                } else res.status(400).send({status: "failure", description: "Password does not match"})
            })
        })
    } catch(e) {
        console.log(e)
        createError(500)
    }
})

/** POST /auth/renew
 * Used to refresh a token close to expiration.
 * Requires: {token}
 * Response: {token}
 */
router.post("/auth/renew", async (req, res) => {
    if (!req.body.token) return res.status(401).send({status: "failure", description: "Incomplete request"})
    try {
        await token.check(req.body.token, "none", async (email) => {
            if (email) {
                await token.get(email, (result) => {
                    res.send({status: "success", token: result})
                })
            } else res.status(403).send({status: "failure", description: "Token invalid"})
        })
    } catch(e) {
        console.log(e)
        createError(500)
    }
})

/** POST /users
 * Used for modifying account permissions.
 * Requires: {token, email, newPermission}
 */
router.post("/users", async (req, res) => {
    if (!req.body.token || !req.body.email || !req.body.newPermission) res.status(401).send({status: "failure", description: "Incomplete request"})
    await token.check(req.body.token, "admin", async (result) => {
        if (!result) res.status(403).send({status: "failure", description: "Forbidden"})
        else try {
            await connection.query("UPDATE user SET permission = ? WHERE (email = ?)", [req.body.newPermission, req.body.email], async (err, rows, fields) => {
                if (err) throw err
                res.status(200).send()
            })
        } catch (e) {
            console.log(e)
            createError(500)
        }
    })
})

/** GET /users
 * Generate a list of all accounts and relevant info.
 * Requires: {token}
 * Response: {rows, fields} ; fields: {email, name, permission} from user
 */
router.get("/users/:token", async (req, res) => {
    if (!req.params.token) res.status(401).send({status: "failure", description: "No token"})
    await token.check(req.params.token, "admin", async (result) => {
        if (!result) res.status(403).send({status: "failure", description: "Forbidden"})
        else try {
            await connection.query("SELECT email, name, permission FROM user", async (err, rows, fields) => {
                if (err) throw err
                res.status(200).send({rows})
            })
        } catch (e) {
            console.log(e)
            createError(500)
        }
    })
})
/** DELETE /users
 * Delete a user account.
 * Requires: {token, email}
 */
router.delete("/users", async (req, res) => {
    if (!req.body.token || !req.body.email) res.status(401).send({status: "failure", description: "Incomplete request"})
    await token.check(req.body.token, "admin", async (result) => {
        if (!result) res.status(403).send({status: "failure", description: "Forbidden"})
        else try {
            await connection.query("DELETE FROM user WHERE (email = ?)", req.body.email, async (err, rows, fields) => {
                if (err) throw err
                res.status(200).send()
            })
        } catch (e) {
            console.log(e)
            createError(500)
        }
    })
})

/**
 * 404 where a path was not found.
 */
router.use(function(req, res, next) {
    next(createError(404))
})

console.log("API Installed")

module.exports = router