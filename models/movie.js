const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 5,
        max: 40,
        required: true,
    },
    genre: {
        genreId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'genre',
        },
        genre_name: {
            type: String,
        }
    },
    releaseDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    rating: {
        type: String,
        required: true,
        max: 5
    }
})

const Movie = mongoose.model('Movie', movieSchema)

const validateMovie = (movie) => {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        genre: Joi.objectId().required(),
        rating: Joi.string().max(5).required()
    });
    return schema.validate(movie);
};

exports.validate = validateMovie
exports.Movie = Movie