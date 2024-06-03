const debug = require('debug')('app:index')
const config = require('config')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')
const genres = require('./routes/genres')
const movies= require('./routes/movies')
const customers = require('./routes/customers')
const users = require('./routes/users')
const auth = require('./routes/auth')
const app= express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json())
app.use('/api/genres', genres)
app.use('/api/movies', movies)
app.use('/api/customers', customers)
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

if(!config.get('myPrivateKey')) {
    debug('FATAL ERROR: jwtPrivateKey is not defined.')
    process.exit(1)
}

mongoose.connect('mongodb://localhost/vidly')
.then(() => index('Successfully connected to MongoDB...'))
.catch((err) => debug(`Couldn't connect to MongoDB`, err))

const port = process.env.PORT || 3600;

app.listen(port, () => debug(`Listening on port ${port}`))