const connection = require("../database/connection");

module.exports = {
    async listAllSpecies(req, res) {
        const { jwt } = req.headers;
        const species = await connection("Specie")
            .select("id_specie", "scientific_name")
        let data = [];
        for (i in species) {
            const photos = await connection("Specie_Photo").select("img_specie").where("fk_id_specie", species[i].id_specie)

            let sp_dt = { "specie_details": species[i], "specie_images": photos }
            data.push(sp_dt);
        }

        return res.json({ "Species": data })
    }
}