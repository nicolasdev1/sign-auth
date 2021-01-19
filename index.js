require('dotenv').config()
const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

app.post('/api/v1/signup', (request, response) => {
    const {
        name,
        email,
        password,
        passwordConfirmation
    } = request.body

    db.query(
        'INSERT INTO users (name, email, password, passwordConfirmation) VALUES (?, ?, ?, ?)',
        [name, email, password, passwordConfirmation],
        (error, rows, _) => {
            error && console.log(error)
            rows && response.send({
                id: rows.insertId,
                name,
                email,
                password,
                passwordConfirmation
            })
        }
    )
})

app.post('/api/v1/signin', (request, response) => {
    const {
        email,
        password
    } = request.body

    db.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (error, rows, _) => {
            error && response.send({ error })
            rows ? response.send(rows) : response.send({ message: 'Wrong email/password combination!' })
        }
    )
})

app.get('/api/v1/users', (_, response) => {
    db.query(
        'SELECT * FROM users',
        [],
        (error, rows, _) => {
            error && console.log(error)
            rows && response.send(rows)
        }
    )
})

app.delete('/api/v1/users/:id', (request, response) => {
    const id = request.params.id

    db.query(
        'DELETE FROM users WHERE id = ?',
        [id],
        (error, result) => {
            error && console.log(error),
            result && response.send({ message: 'User deleted successfully.' })
        }
    )
})

app.get('/api/v1/users/:id', (request, response) => {
    const id = request.params.id

    db.query(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (error, rows, fields) => {
            error && console.log(error)
            rows && response.send(rows)
        }
    )
})

app.listen(process.env.PORT || 7777)
