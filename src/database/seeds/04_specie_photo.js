const images = require("../images")


exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('Specie_Photo').del()
        .then(function () {
            // Inserts seed entries
            return knex('Specie_Photo').insert([
                { img_specie: images.araucaria1, fk_id_specie: 2 }
            ]);
        });
};