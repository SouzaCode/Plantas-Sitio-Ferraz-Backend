const express = require("express");



const SpeciesController = require("./controllers/SpeciesController");
const UserController = require("./controllers/UserController");
const PlantsController = require("./controllers/PlantsController");


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
userRouter.post('/login', UserController.login)

/*Rotas de Plants*/
const plantsRouter = express.Router({ mergeParams: true });
routes.use('/plants', plantsRouter)
plantsRouter.get('/', PlantsController.getAllPlants)
plantsRouter.get('/:id', PlantsController.getPlantDetailsById)

module.exports = routes