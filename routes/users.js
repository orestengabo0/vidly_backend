const debug = require('debug')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('config')
const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const _ = require('lodash')
const { User, validateUser} = require('../models/user')
const { route } = require('./genres')
const routes = express.Router()

routes.get('/me', auth, async (req, res) => {
    debug(`Getting current user...`);
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
})

routes.post('/', async (req, res) => {
    debug(`Creating a new user...`);

    const { error } = validateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne(_.pick(req.body, ['email']))
    if(user) return res.status(400).send('User already registered!')
    
    user = new User(_.pick(req.body, ['name','email','password','isAdmin']))
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    user = await user.save()

    const token = user.generateAuthToken()
    res.header('x-auth-token', token).send(_.pick(user, ['name','email']))
})
module.exports = routes