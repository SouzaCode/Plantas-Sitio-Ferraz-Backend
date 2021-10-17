const connection = require("../database/connection");

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
        return res.json({ "Details": specie[0], "Photos": photos })
    }
}