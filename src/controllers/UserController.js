const connection = require("../database/connection");
const CryptoJS = require("crypto-js")
const jwt = require('jsonwebtoken');

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
            "hash_password": CryptoJS.MD5(hash_password + process.env.SALT_PASSWORD)
        }) // Talvez fosse bom verificar algum possivel erro aqui...
        return res.json({ "Response": "User created successfully! Please Login to get your access token." })
    },
    async login(req, res) {
        const { email, hash_password } = req.body;
        const user = await connection("User").select("*").where("email", email);
        let salt_password = await CryptoJS.MD5(hash_password + process.env.SALT_PASSWORD);
        if (!user.length) {
            return res.status(404).json({ "Error": "Email not found on database." });
        }
        if (user[0].hash_password != salt_password) {
            return res.status(404).json({ "Error": "Wrong Password!" });
        }
        const token = jwt.sign(
            {
                id_user: user[0].id_user,
                email: user[0].email,
                name: user[0].name
            }, process.env.SECRET_JWT, { expiresIn: '24h' });
        return res.json({
            "token": token,
            "profile_image": user[0].profile_image
        })
    },
    async updateUserData(req, res) {
        const { email, name } = req.body;
        const { id } = req.params;
        const { token } = req.headers;

        const oldUser = await connection("User").select("email", "name", "id_user").where("id_user", id);
        if (!oldUser.length) {
            return res.status(404).json({ "Error": "User not found" })
        }
        if (token) {
            try {
                let decodedJWT = jwt.verify(token, process.env.SECRET_JWT);
                if (decodedJWT.id_user != oldUser[0].id_user) {
                    return res.status(401).json({ "Error": "You do not have access to this!" })
                }
            } catch (err) {
                return res.status(401).json({ "Error": "Invalid Token with message '" + err + "'" })
            }
        } else { return res.status(401).json({ "Error": "You are not logged in." }) }

        let newEmail = email ? email : oldUser[0].email;
        let newName = name ? name : oldUser[0].name;

        const newUser = await connection("User").update({
            "email": newEmail,
            "name": newName
        }).where("id_user", id)
        if (!newUser) {
            return res.status(500).json({ "Error": "Error on data update" })
        }

        return res.json({ "Response": "Data update successfully" })
    },
    async updateUserImage(req, res) {
        const { photo } = req.body;
        const { id } = req.params;
        const { token } = req.headers;

        if (!photo) {
            return res.status(400).json({ "Error": "Image not provided" })
        }

        const oldUser = await connection("User").select("id_user").where("id_user", id);
        if (!oldUser.length) {
            return res.status(404).json({ "Error": "User not found" })
        }
        if (token) {
            try {
                let decodedJWT = jwt.verify(token, process.env.SECRET_JWT);
                if (decodedJWT.id_user != oldUser[0].id_user) {
                    return res.status(401).json({ "Error": "You do not have access to this!" })
                }
            } catch (err) {
                return res.status(401).json({ "Error": "Invalid Token with message '" + err + "'" })
            }
        } else { return res.status(401).json({ "Error": "You are not logged in." }) }


        const newUser = await connection("User").update({
            "profile_image": photo
        }).where("id_user", id)
        if (!newUser) {
            return res.status(500).json({ "Error": "Error on image update" })
        }

        return res.json({ "Response": "Image update successfully" })
    }
}