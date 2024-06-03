const mongoose = require('mongoose')
const Joi = require('joi')

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 5,
        max: 50,
        required: true
    }
})

const Genre = mongoose.model('Genres', genreSchema)

const validateGenre = (genre) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required()
    })
    return schema.validate(genre)
}
exports.validateGenre = validateGenre
exports.Genre = Genre