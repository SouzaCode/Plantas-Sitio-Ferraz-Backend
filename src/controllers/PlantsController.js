const connection = require("../database/connection");
const jwt = require('jsonwebtoken');

module.exports = {
    async getAllPlants(req, res) {
        const { species, users, token } = req.headers;
        return res.json({ "Resp": "xdcyvub" })
    }
}