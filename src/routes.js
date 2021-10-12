const express = require("express")



const SpeciesController = require("./controllers/SpeciesController")


const routes = express.Router()


// req.query
// req.params
// req.body

routes.get("/species", SpeciesController.listAllSpecies)


module.exports = routes