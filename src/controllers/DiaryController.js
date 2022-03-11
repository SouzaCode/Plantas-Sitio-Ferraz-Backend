const connection = require("../database/connection");
const jwt = require('jsonwebtoken');

module.exports = {
    async addDiaryEntry(req, res) {
        const { id_plant } = req.params;
        const { token } = req.headers
        const { entry } = req.body
        let decodedJWT;
        if (token) {
            try {
                decodedJWT = jwt.verify(token, process.env.SECRET_JWT);
            } catch (err) {
                return res.status(401).json({ "Error": "Invalid Token with message '" + err + "'" })
            }
        } else { return res.status(401).json({ "Error": "You are not logged in." }) }

        const plant = await connection("Plant").select("id_plant").where("id_plant", id_plant);
        if (plant.length == 0) {
            return res.status(404).json({ "Error": "Plant id not found" })
        }
        const diary_entry = await connection("Diary").insert({
            "annotation": entry,
            "fk_id_plant": id_plant,
            "dt_entry": parseInt(Date.now() / 1000)
        })
        return res.json({ "Response": "Diary entry created successfully" })

    }
}