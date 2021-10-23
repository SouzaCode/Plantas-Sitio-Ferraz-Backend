const connection = require("../database/connection");
const jwt = require('jsonwebtoken');

module.exports = {
    async getAllPlants(req, res) {
        const { species, users, token, private, page } = req.headers;
        let pageNumber = page ? parseInt(page) * 10 : 0;
        let decodedJWT;
        let userQuery = ""
        if (users) {
            userQuery = " where Plant.fk_id_user in (" + users + ")"
        }
        let speciesQuery = "";
        if (species) {
            if (users) {
                speciesQuery = " and Plant.fk_id_specie in (" + species + ")"
            } else {
                speciesQuery = " where Plant.fk_id_specie in (" + species + ")"
            }

        }
        if (token) {
            try {
                decodedJWT = jwt.verify(token, process.env.SECRET_JWT);
            } catch (err) {
                return res.status(401).json({ "Error": "Invalid Token with message '" + err + "'" })
            }
        }
        let privateQuery = ""
        if (private == 1) {
            if (!decodedJWT) {
                return res.status(401).json({ "Error": "No token provided." })
            }
            if (users || species) {
                privateQuery = " and Plant.is_private = 0 or Plant.fk_id_user = " + decodedJWT.id_user;
            } else {
                privateQuery = " where Plant.is_private = 0 or Plant.fk_id_user = " + decodedJWT.id_user;
            }
            privateQuery = privateQuery
        } else {

            if (users) {
                if (species)
                    privateQuery = " and Plant.is_private = 0"
                else
                    privateQuery = " where Plant.is_private = 0";
            } else {
                if (decodedJWT) {
                    if (species)
                        privateQuery = " and Plant.is_private = 0 or Plant.fk_id_user = " + decodedJWT.id_user;
                    else {
                        privateQuery = " where Plant.is_private = 0 or Plant.fk_id_user = " + decodedJWT.id_user;
                    }
                }
            }


        }
        let final_query = "select Plant.*, Specie.scientific_name, User.name as user_name from Plant join Specie on Specie.id_specie = Plant.fk_id_specie join User on User.id_user = Plant.fk_id_user" + userQuery + speciesQuery + privateQuery + " limit 10 offset " + pageNumber;
        console.log(final_query);
        const plants = await connection.raw(final_query)
        let plantsData = [];
        if (plants.length) {
            for (i in plants) {
                const plt_imgs = await connection("Plant_Photo").where("fk_id_plant", plants[i].id_plant);
                plantsData.push({
                    "Details": plants[i],
                    "Images": plt_imgs
                })
            }
        }
        const rows = await connection('Plant').count('id_plant', { as: 'count' })
        console.log(rows);
        return res.json({ "Total": rows[0].count, "Plants": plantsData })
    },
    async getPlantDetailsById(req, res) {
        const { id } = req.params;
        const { token } = req.headers
        const plant_details = await connection("Plant")
            .select("Plant.*", "Specie.scientific_name", "User.name as creator_name", "UserB.name as planter_name")
            .join("Specie", "Specie.id_specie", "Plant.fk_id_specie")
            .leftJoin("User", "User.id_user", "Plant.fk_id_user")
            .leftJoin("User as UserB", "User.id_user", "Plant.id_planter")
            .where("id_plant", id);
        if (!plant_details.length) {
            return res.status(404).json({ "Error": "No plant with id " + id });
        }

        if (plant_details[0].is_private == 1) {
            if (token) {
                try {
                    decodedJWT = jwt.verify(token, process.env.SECRET_JWT);
                    if (decodedJWT.id_user != plant_details[0].fk_id_user) {
                        return res.status(401).json({ "Error": "You do not have access to this!" })
                    }
                } catch (err) {
                    return res.status(401).json({ "Error": "Invalid Token with message '" + err + "'" })
                }
            } else
                return res.status(401).json({ "Error": "You are not logged in." })
        }
        const diary_entries = await connection("Diary").select("*").where("fk_id_plant", id);
        const plant_photos = await connection("Plant_Photo").select("*").where("fk_id_plant", id);
        return res.json({
            "Response": {
                "Details": plant_details[0],
                "Photos": plant_photos,
                "Diary": diary_entries
            }
        })
    }
}