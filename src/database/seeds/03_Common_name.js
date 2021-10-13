exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('Common_Name').del()
        .then(function () {
            // Inserts seed entries
            return knex('Common_Name').insert([
                { name: "Araucária", fk_id_specie: 1 },
                { name: "Pinheiro do Paraná", fk_id_specie: 1 }
            ]);
        });
};