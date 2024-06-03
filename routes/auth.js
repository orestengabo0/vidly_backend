const debug = require('debug')('app:auth')
const config = require('config')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const express = require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const _ = require('lodash')
const { User} = require('../models/user')
const routes = express.Router()

routes.post('/', async (req, res) => {
    debug(`Authorizing the user`)
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne(_.pick(req.body, ['email']))
    if(!user) return res.status(400).send('Invalid email or password.')
    
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Invalid email or password.')

    const token = user.generateAuthToken()
    res.send(token)
})

const validate = (user) => {
    const schema = Joi.object({
        email: Joi.string().min(10).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    })
    return schema.validate(user)
}

module.exports = routes