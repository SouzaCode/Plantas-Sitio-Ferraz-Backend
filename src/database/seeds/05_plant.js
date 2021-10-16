exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('Plant').del()
        .then(function () {
            // Inserts seed entries
            return knex('Plant').insert([
                { id_plant: "abc", fk_id_specie: 1, fk_id_user: 1, observations: "Reguei uma vez por dia", day_planted: 10, month_planted: 05, year_planted: 2021, is_private: false },

                { id_plant: "ab1", fk_id_specie: 1, fk_id_user: 1, observations: "Reguei com gotejador", month_planted: 05, year_planted: 2021, is_private: true }
            ]);
        });
};