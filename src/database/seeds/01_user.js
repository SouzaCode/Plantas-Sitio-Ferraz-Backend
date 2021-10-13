exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('User').del()
        .then(function () {
            // Inserts seed entries
            return knex('User').insert([
                { name: "Rodrigo Ferraz Souza", email: "xm22w.slr@gmail.com", hash_password: "cc1967f5d84562e313eaec3c2d0214bd" },
                { name: "Vinicius Ferraz Souza", email: "vini.fsouza@gmail.com", hash_password: "97eb92837f6f2a6e2be6ff196f040898" }
            ]);
        });
};