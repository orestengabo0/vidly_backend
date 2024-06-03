const debug = require('debug')('app:movies')
const mongoose = require("mongoose");
const express = require("express");
const _ = require("lodash");
const { validate, Movie } = require("../models/movie");
const { Genre } = require("../models/genre");
const admin = require('../middleware/auth');
const auth = require('../middleware/auth');
const routes = express.Router();

routes.get("/", async (req, res) => {
  debug(`Getting movies...`);
  const genres = await Genre.find();
  const movies = await Movie.find();
  if (!movies) return res.status(404).send("No movie found.");
  if(movies.genre){
      const responseBody = movies.map((movie) => {
      const movieGenre = genres.filter(
          (genre) => genre._id.toString() === movie.genre.genreId
      )
      const genreName = movieGenre.map((genre) => genre.name)
        return {
            name: movies.name,
            rating: movies.rating,
            genre_name: genreName.join(', ')
        }
      })
      res.send(responseBody);
    } else {
        const responseBody = movies.map((movie) => {
        const movieGenre = genres.filter(
            (genre) => genre._id.toString() === movie.genre.genreId
        )
        const genreName = movieGenre.map((genre) => genre.name)
        return {
            name: movies.name,
            rating: movies.rating,
            genre_name: "No genre found"
        };
    })
        res.send(responseBody)
    }
});

routes.get("/:id", async (req, res) => {
  debug(`Getting movie with ID: ${req.params.id}`);
  const responseMessage = "No movie found";
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send(responseMessage);

  const genre = await Genre.findById(movie.genre.genreId);
  if (!genre) return res.status(400).send(responseMessage);

  const responseBody = _.pick(movie, ["name", "releaseDate", "rating"]);
  responseBody.genre = genre.name;
  res.send(responseBody);
});

routes.post("/", [auth, admin],async (req, res) => {
  debug(`Creating a new movies...`);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genre);
  if (!genre) return res.status(400).send("No genre found");

  let movie = new Movie(_.pick(req.body, ["name", "rating"]));
  movie.genre = {
    genreId: req.body.genreId,
    genre_name: genre.name,
  };

  await movie.save();
  const responseBody = _.pick(movie, ["name", "releaseDate", "rating"]);
  responseBody.genre_name = genre.name;
  res.send(responseBody);
});

routes.put("/:id", [auth, admin],async (req, res) => {
  debug(`Updating movie with ID: ${req.params.id}`);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genre);
  if (!genre) return res.status(400).send("Invalid genre");

  const updateField = _.pick(req.body, ["name", "rating", "genre"]);
  updateField.genre = {
    genreId: req.body.genreId,
    genre_name: genre.name,
  };

  const movie = await Movie.findByIdAndUpdate(req.params.id, updateField, {
    new: true,
  });
  const responseBody = _.pick(movie, ["name", "releaseDate", "rating"]);
  responseBody.genre_name = genre.name;
  res.send(responseBody);
});

routes.delete("/:id", [auth, admin],async (req, res) => {
  debug(`Deleting movies with ID: ${req.params.id}`);
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if(!movie) return res.status(400).send('No movie found to delete')
  
  const responseBody = _.pick(movie, ['name','releaseDate','rating'])
  res.send(responseBody)
});

module.exports = routes;
