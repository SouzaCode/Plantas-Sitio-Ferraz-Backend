
exports.up = function (knex) {
    return knex.schema.createTable('Specie', function (table) {
        table.increments("id_specie").primary();
        table.string("scientific_name").notNullable();
        table.string("description");
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('Specie');
};
