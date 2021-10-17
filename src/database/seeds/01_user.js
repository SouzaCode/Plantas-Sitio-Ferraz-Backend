exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('User').del()
        .then(function () {
            // Inserts seed entries
            return knex('User').insert([
                { name: "Rodrigo Ferraz Souza", email: "xm22w.slr@gmail.com", hash_password: "f0de1834b00994b1698619d6cd102994" }, //23011306
                { name: "Vinicius Ferraz Souza", email: "vini.fsouza@gmail.com", hash_password: "1a803606ee5af747c651cd89443b808a" } //130608
            ]);
        });
};