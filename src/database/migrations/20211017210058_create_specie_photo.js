
exports.up = function (knex) {
    return knex.schema.createTable('Specie_Photo', function (table) {
        table.increments("id_specie_photo").primary();
        table.text("img_specie");
        table.integer("fk_id_specie")
            .references('id_specie')
            .inTable('Specie')
            .notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('Specie_Photo');
};
