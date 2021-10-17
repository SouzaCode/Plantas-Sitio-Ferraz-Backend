const express = require("express");



const SpeciesController = require("./controllers/SpeciesController");


const routes = express.Router();


// req.query
// req.params
// req.body

/*Rotas de Specie */
const speciesRouter = express.Router({ mergeParams: true });
routes.use('/species', speciesRouter);
speciesRouter.get("/", SpeciesController.listAllSpecies);
speciesRouter.get("/:id", SpeciesController.getSpecieDetails);


module.exports = routes