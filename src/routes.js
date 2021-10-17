const express = require("express");



const SpeciesController = require("./controllers/SpeciesController");
const UserController = require("./controllers/UserController");


const routes = express.Router();


// req.query
// req.params
// req.body

/*Rotas de Specie */
const speciesRouter = express.Router({ mergeParams: true });
routes.use('/species', speciesRouter);
speciesRouter.get("/", SpeciesController.listAllSpecies);
speciesRouter.get("/:id", SpeciesController.getSpecieDetails);

/*Rotas de User */
const userRouter = express.Router({ mergeParams: true });
routes.use('/user', userRouter);
userRouter.put('/register', UserController.registerNewUser)

module.exports = routes