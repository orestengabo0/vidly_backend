const debug = require('debug')('app:customer')
const mongoose = require('mongoose')
const express = require('express')
const {validate, Customer} = require('../models/customer')
const routes = express.Router()
const _ = require('lodash')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

routes.get('/', async (req, res) => {
    debug('Retreiving customers...')
    const customer = await Customer.find()
    if(!customer) return res.status(404).send('No customer found')
    res.send(_.pick(customer, ['Customer_name','Customer_email']))
})

routes.get('/:id', async (req, res) => {
    debug(`Retrieving customer with ID: ${req.params.id}`);
    const customer = await Customer.findById(req.params.id)
    if(!customer) return res.status(404).send('No customer found')
    res.send(_.pick(customer,['Customer_name','Customer_email']))
})
routes.post('/', [auth, admin],async (req, res) => {
    debug('Creating new customer...');
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    const customer = new Customer({
        Customer_name: req.body.Customer_name,
        Customer_email: req.body.Customer_email
    })
    await customer.save()
    res.send(_.pick(customer, ['Customer_name','Customer_email']))
})

routes.put('/:id', [auth, admin], async(req, res) => {
    debug(`Updating customer with ID: ${req.params.id}`);
    const { error } = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findByIdAndUpdate(req.params.id,
         _.pick(req.body,['Customer_name','Customer_email']),
        { new: true})

    res.send(_.pick(customer, ['Customer_name','Customer_email']))
})

routes.delete('/:id', async (req, res) => {
    debug(`Deleting customer with ID: ${req.params.id}`);
    const customer= await Customer.findByIdAndDelete(req.params.id)
    if(!customer) return res.status(400).send('No customer found to delete')
    res.send(_.pick(customer, ['Customer_name','Customer_email']))
})
module.exports = routes