const images = require("../images")

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('Plant_Photo').del()
        .then(function () {
            // Inserts seed entries
            return knex('Plant_Photo').insert([
                { img_plant: images.muda_araucaria1, fk_id_plant: "abc", fk_id_user: 1, img_date: parseInt(new Date(2021, 08, 6).getTime() / 1000) }
            ]);
        });
};