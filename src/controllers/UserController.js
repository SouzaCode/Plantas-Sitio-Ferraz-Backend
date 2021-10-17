const connection = require("../database/connection");

module.exports = {
    async registerNewUser(req, res) {
        const { email, hash_password, name } = req.body;
        const previousUser = await connection("User").select("name").where("email", email);
        if (previousUser.length) {
            return res.status(400).json({ "Error": "Email already registered. Please use another one." })// Verificar este código
        }
        const newUser = await connection("User").insert({
            "email": email,
            "name": name,
            "hash_password": hash_password
        })
        return res.json({ "Response": "User created successfully! Please Login to get your access token." })
    }
}