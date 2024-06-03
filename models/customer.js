const Joi = require('joi')
Joi.objectId = require('joi-objectid')
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    Customer_name: {
        type: String,
        required: true
    },
    Customer_email: {
        type: String,
        min: 5,
        max: 255,
        required: true
    }
})

const Customer = mongoose.model('Customer', customerSchema)

const validateCustomer = (customer) => {
    const schema = Joi.object({
        Customer_name: Joi.string().required(),
        Customer_email: Joi.string().min(5).max(255).email().required()
    })
    return schema.validate(customer)
}

exports.validate = validateCustomer
exports.Customer = Customer
