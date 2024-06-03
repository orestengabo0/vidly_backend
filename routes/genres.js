const debug = require('debug')('app:genres')
const express = require('express')
const mongoose = require('mongoose')
const _ = require('lodash')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const { Genre, validateGenre} = require('../models/genre')
const routes = express.Router()

routes.get('/', async (req, res) => {
    debug('Retrieving genres...')
    const genre = await Genre.find()
    if(!genre) return res.status(404).send('No genre found')
    res.send(_.pick(genre, ['name']))
})

routes.get('/:id', async (req, res) => {
    debug(`Retrieving genres with ID ${req.params.id}`)
    const genre = await Genre.findById(req.params.id)
    if(!genre) return res.status(404).send('No genre found')
    res.send(_.pick(genre, ['name']))
})
routes.post('/', [auth, admin], async (req, res) => {
    debug('Creating a new genre...')
    const { error } = validateGenre(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    let genre = new Genre(_.pick(req.body, ['name']))
    genre = await genre.save()
    res.send(_.pick(genre, ['name']))
})
routes.put('/:id', [auth, admin], async (req, res) => {
    debug(`Updating a genre with ID of ${req.params.id}`)
    const { error } = validateGenre(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const genre = await Genre.findByIdAndUpdate(req.params.id , 
    _.pick(req.body, ['name']),
    { new: true })
    if(!genre) return res.status(400).send(`No genre with id = ${req.params.id} found to update.`)
    res.send(_.pick(genre, ['name']))
})
routes.delete('/:id', [auth, admin], async (req, res) => {
    debug(`Deleting the genre with ID of ${req.params.id}`)
    const genre = await Genre.findByIdAndDelete(req.params.id)
    if(!genre) return res.status(400).send(`No genre with id = ${req.params.id} found to delete.`)
    res.send(_.pick(genre, ['name']))
})

module.exports = routes