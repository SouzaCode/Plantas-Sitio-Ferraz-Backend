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
speciesRouter.put("/", SpeciesController.newSpecies);
speciesRouter.get("/:id", SpeciesController.getSpecieDetails);
speciesRouter.delete("/:id", SpeciesController.deleteSpecieByID);

/*Rotas de User */
const userRouter = express.Router({ mergeParams: true });
routes.use('/user', userRouter);
userRouter.put('/register', UserController.registerNewUser)
userRouter.post('/login', UserController.login)
userRouter.post('/:id', UserController.updateUserData)
userRouter.post('/photo/:id', UserController.updateUserImage)

/*Rotas de Plants*/
const plantsRouter = express.Router({ mergeParams: true });
routes.use('/plants', plantsRouter)
plantsRouter.get('/', PlantsController.getAllPlants)
plantsRouter.get('/:id', PlantsController.getPlantDetailsById)
plantsRouter.delete('/:id', PlantsController.deletePlantByID)
plantsRouter.post('/kill/:id', PlantsController.killPlant)
plantsRouter.put('/', PlantsController.addNewPlant)

module.exports = routes