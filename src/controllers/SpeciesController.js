const connection = require("../database/connection");

module.exports = {
    async listAllSpecies(req, res) {
        return res.json({ "Res": "OK" })
    }
}