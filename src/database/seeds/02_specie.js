exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('Specie').del()
        .then(function () {
            // Inserts seed entries
            return knex('Specie').insert([
                { scientific_name: "Araucaria Angustifolia", description: "Plantar o pinhão em pé e no inverno. Regar 250ml de água a cada 2 dias." }
            ]);
        });
};