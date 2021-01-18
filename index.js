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
    database: process.env.DB_NAME
})

app.post('/register', (request, response) => {
    const {
        name,
        email,
        password,
        passwordConfirmation
    } = request.body

    db.query(
        'INSERT INTO users (name, email, password, passwordConfirmation) VALUES (?, ?, ?, ?)',
        [name, email, password, passwordConfirmation],
        (error, result) => {
            error && console.log(error)
            result && response.send({
                name,
                email,
                password,
                passwordConfirmation
            })
        }
    )
})

app.post('/login', (request, response) => {
    const {
        email,
        password
    } = request.body

    db.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (error, result) => {
            error && response.send({ error })
            result ? response.send(result) : response.send({ message: 'Wrong email/password combination!' })
        }
    )
})

app.get('/users', (request, response) => {
    db.query(
        'SELECT * FROM users',
        [],
        (error, rows, fields) => {
            error && console.log(error)
            rows && response.send(rows)
        }
    )
})

app.delete('/users/:id', (request, response) => {
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

const port = process.env.PORT || 5001

app.listen(port, () => console.log(`Server running on port ${port}...`))
