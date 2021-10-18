const connection = require("../database/connection");
const jwt = require('jsonwebtoken');

module.exports = {
    async getAllPlants(req, res) {
        const { species, users, token, private } = req.headers;

        let decodedJWT;
        let userQuery = ""
        if (users) {
            userQuery = " where fk_id_user in (" + users + ")"
        }
        let speciesQuery = "";
        if (species) {
            if (users) {
                speciesQuery = " and fk_id_specie in (" + species + ")"
            } else {
                speciesQuery = " where fk_id_specie in (" + species + ")"
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
            if (users || species) {
                privateQuery = " and is_private = 0 or fk_id_user = " + decodedJWT.id_user;
            } else {
                privateQuery = " where is_private = 0 or fk_id_user = " + decodedJWT.id_user;
            }
            privateQuery = privateQuery
        } else {

            if (users) {
                if (species)
                    privateQuery = " and is_private = 0"
                else
                    privateQuery = " where is_private = 0";
            } else {
                if (species)
                    privateQuery = " and is_private = 0 or fk_id_user = " + decodedJWT.id_user;
                else {
                    privateQuery = " where is_private = 0 or fk_id_user = " + decodedJWT.id_user;
                }
            }


        }
        let final_query = "select * from Plant" + userQuery + speciesQuery + privateQuery;
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
        return res.json({ "Plants": plantsData })
    }
}