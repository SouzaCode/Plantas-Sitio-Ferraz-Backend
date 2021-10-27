const connection = require("../database/connection");
const jwt = require('jsonwebtoken');

const CryptoJS = require("crypto-js")
module.exports = {
    async listAllSpecies(req, res) {
        const species = await connection("Specie")
            .select("id_specie", "scientific_name")
        let data = [];
        for (i in species) {
            const photos = await connection("Specie_Photo").select("img_specie").where("fk_id_specie", species[i].id_specie)

            let sp_dt = { "specie_details": species[i], "specie_images": photos }
            data.push(sp_dt);
        }

        return res.json({ "Species": data })
    },
    async getSpecieDetails(req, res) {
        const { id } = req.params;
        const specie = await connection("Specie").select("*").where("id_specie", id);
        if (!specie.length) {
            return res.status(404).json({ "Error": "No species found with id " + id })
        }
        const photos = await connection("Specie_Photo").select("img_specie").where("fk_id_specie", id)
        const names = await connection("Common_Name").select("name").where("fk_id_specie", id)
        return res.json({ "Details": specie[0], "Photos": photos, "Common_Names": names })
    },
    async deleteSpecieByID(req, res) {
        const { id } = req.params;
        const { secret } = req.headers
        if (id == 1) {
            return res.status(401).json({ "Error": "You can't delete the base category!!" })
        }
        const specie_details = await connection("Specie")
            .select("*")
            .where("id_specie", id);
        if (!specie_details.length) {
            return res.status(404).json({ "Error": "No specie with id " + id });
        }

        if (secret) {
            let hash_secret = await CryptoJS.MD5(process.env.SECRET_JWT);
            if (secret != hash_secret) {
                return res.status(401).json({ "Error": "Wrong secret" })
            }
        } else { return res.status(401).json({ "Error": "You have to provide the secret message!!" }) }
        const mod_plant = await connection("Plant").update("fk_id_specie", 1).where("fk_id_specie", id);
        const specie_del = await connection("Specie").delete().where("id_specie", id)
        return res.json({ "Response": "Specie deleted successfully" });
    },
    async newSpecies(req, res) {
        const { scientific_name, common_names, photos, description } = req.body;
        const { token } = req.headers;

        console.log(common_names, photos);
        if (!scientific_name) {
            return res.status(400).json({ "Error": "Name not provided" })
        }

        const spcVerify = await connection("Specie").whereRaw("LOWER(scientific_name) = '" + scientific_name.toLowerCase() + "'")
        if (spcVerify.length) {
            return res.status(401).json({ "Error": "Specie already exists" })
        }

        if (token) {
            try {
                let decodedJWT = jwt.verify(token, process.env.SECRET_JWT);

            } catch (err) {
                return res.status(401).json({ "Error": "Invalid Token with message '" + err + "'" })
            }
        } else { return res.status(401).json({ "Error": "You are not logged in." }) }

        const newSpecies = await connection("Specie").insert({
            "scientific_name": scientific_name,
            "description": description
        })
        if (common_names) {
            for (i in common_names) {
                const newName = await connection("Common_Name").insert({
                    "fk_id_specie": newSpecies[0],
                    "name": common_names[i]
                })
            }
        }

        if (photos) {
            for (i in photos) {
                const newPhoto = await connection("Specie_Photo").insert({
                    "fk_id_specie": newSpecies[0],
                    "img_specie": photos[i]
                })
            }
        }

        return res.json({ "Response": "Species created successfully, with id " + newSpecies[0] })
    }
}