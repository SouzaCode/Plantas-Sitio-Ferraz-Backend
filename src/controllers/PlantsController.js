const connection = require("../database/connection");
const jwt = require('jsonwebtoken');
const randomString = require('random-base64-string')

module.exports = {
    async getAllPlants(req, res) {
        const { species, users, token, is_private, page } = req.headers;

        let pageNumber = page ? parseInt(page) * 10 : 0;
        let decodedJWT;
        let userQuery = ""
        const subquery = connection("Plant")
            .select("Plant.*", "Specie.scientific_name")
            .join("Specie", "Specie.id_specie", "Plant.fk_id_specie")

        if (species && species != "") {
            subquery.whereIn("Plant.fk_id_specie", species.split(','))
        }
        if (is_private == 1) {
            if (token) {
                try {
                    decodedJWT = jwt.verify(token, process.env.SECRET_JWT);
                } catch (err) {
                    return res.status(401).json({ "Error": "Invalid Token with message '" + err + "'" })
                }
            }
            if (!decodedJWT) {
                return res.status(401).json({ "Error": "No token provided." })
            }
            subquery.where("Plant.fk_id_user", decodedJWT.id_user).where("is_private", 1)
        } else {
            if (users && users != "") {
                subquery.whereIn("Plant.fk_id_user", users.split(','))
            }
            subquery.where("Plant.is_private", 0)
        }
        subquery.limit(10).offset(pageNumber)
        console.log(subquery.toString())

        const plants = await subquery
        console.log(plants);
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
            .where("Plant.id_plant", id);
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
    },
    async deletePlantByID(req, res) {
        const { id } = req.params;
        const { token } = req.headers
        const plant_details = await connection("Plant")
            .select("*")
            .where("id_plant", id);
        if (!plant_details.length) {
            return res.status(404).json({ "Error": "No plant with id " + id });
        }

        if (token) {
            try {
                let decodedJWT = jwt.verify(token, process.env.SECRET_JWT);
                if (decodedJWT.id_user != plant_details[0].fk_id_user) {
                    return res.status(401).json({ "Error": "You do not have access to this!" })
                }
            } catch (err) {
                return res.status(401).json({ "Error": "Invalid Token with message '" + err + "'" })
            }
        } else { return res.status(401).json({ "Error": "You are not logged in." }) }
        const plant_del = await connection("Plant").delete().where("id_plant", id)
        return res.json({ "Response": "Plant deleted successfully" });
    },
    async killPlant(req, res) {
        const { id } = req.params;
        const { token } = req.headers
        let decodedJWT;
        if (token) {
            try {
                decodedJWT = jwt.verify(token, process.env.SECRET_JWT);
            } catch (err) {
                return res.status(401).json({ "Error": "Invalid Token with message '" + err + "'" })
            }
        } else { return res.status(401).json({ "Error": "You are not logged in." }) }

        const plant = await connection("Plant").select("*").where("id_plant", id);
        if (!plant.length) {
            return res.status(404).json({ "Error": "Plant not Found" })
        }
        const timeNow = parseInt(Date.now() / 1000)
        const nplant = await connection("Plant").update("date_death", timeNow).where("id_plant", id);

        const diary = await connection("Diary").insert({
            "annotation": "User " + decodedJWT.name + " marked this plant as DEAD",
            "fk_id_plant": id,
            "dt_entry": timeNow
        })
        return res.json({ "Response": "Plant killed successfully" });
    },
    async addNewPlant(req, res) {
        const { token } = req.headers;
        const { id_specie, new_common_name, photos, year, month, day, gps_position, observations, is_private, id_planter } = req.body;
        let decodedJWT;
        if (token) {
            try {
                decodedJWT = jwt.verify(token, process.env.SECRET_JWT);
            } catch (err) {
                return res.status(401).json({ "Error": "Invalid Token with message '" + err + "'" })
            }
        } else { return res.status(401).json({ "Error": "You are not logged in." }) }
        const specie = await connection("Specie").select("id_specie").where("id_specie", id_specie);
        if (specie.length == 0) {
            return res.status(404).json({ "Error": "Specie not found" })
        }
        console.log(Date.now() / 1000);
        //console.log(parseInt(new Date(2021, 08, 6).getTime() / 1000));
        //console.log(id_specie, new_common_name, photos, year, month, day, gps_position);



        var new_plant_id = randomString(parseInt(process.env.PLANT_ID_LENGTH));
        var achou = false;
        do {
            const exist_plant = await connection("Plant").select("id_plant").where("id_plant", new_plant_id)
            if (exist_plant.length > 0) {
                achou = true; new_plant_id = randomString(parseInt(process.env.PLANT_ID_LENGTH));
            } else {
                achou = false;
            }
        } while (achou)

        const plant = await connection("Plant").insert({
            "id_plant": new_plant_id,
            "fk_id_specie": id_specie,
            "fk_id_user": decodedJWT.id_user,
            "observations": observations,
            "day_planted": day ? day : null,
            "month_planted": month ? month : null,
            "year_planted": year ? year : null,
            "latitude": gps_position ? gps_position.latitude : null,
            "longitude": gps_position ? gps_position.longitude : null,
            "is_private": is_private,
            "id_planter": id_planter ? id_planter : null


        })
        if (!plant) {
            return res.status(500).json({ "Error": "Error on plant creation" });

        }
        for (i in photos) {
            pht = photos[i];
            const image = await connection("Plant_Photo").insert({
                "img_plant": pht.image,
                "fk_id_user": decodedJWT.id_user,
                "img_date": pht.image_timestamp ? pht.image_timestamp : parseInt(Date.now() / 1000),
                "fk_id_plant": new_plant_id
            })
            if (!image) {
                return res.status(500).json({ "Error": "Error on adding plant photo with index " + i });

            }
        }
        if (new_common_name && new_common_name.length > 0) {
            for (i in new_common_name) {
                const cm_name = await connection("Common_Name").select("*").where("name", new_common_name[i]).where("fk_id_specie", id_specie);
                if (cm_name.length) {
                    continue
                }
                const commom_name = await connection("Common_Name").insert({
                    "name": new_common_name[i],
                    "fk_id_specie": id_specie
                })
                if (!commom_name) {
                    return res.status(500).json({ "Error": "Error on adding plant common name with index " + i });

                }
            }
        }
        return res.json({ "Response": "Plant with id " + new_plant_id + " created successfully" });

    }

}