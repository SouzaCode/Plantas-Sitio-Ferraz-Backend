exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('Diary').del()
        .then(function () {
            // Inserts seed entries
            return knex('Diary').insert([
                { annotation: "Ela ficou doente. Está com uns pontos pretos... Não sei o que é.", dt_entry: parseInt(new Date(2021, 05, 24).getTime() / 1000), fk_id_plant: "abc" }
            ]);
        });
};