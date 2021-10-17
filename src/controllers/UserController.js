const connection = require("../database/connection");

module.exports = {
    async registerNewUser(req, res) {
        const { email, hash_password, name } = req.body;
        return res.json({ "OI": [email, hash_password, name] })
    }
}