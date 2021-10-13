
exports.up = function (knex) {
    return knex.schema.createTable('Common_Name', function (table) {
        table.increments("id_common_name").primary();
        table.string("name");
        table.integer("fk_id_specie")
            .references('id_specie')
            .inTable('Specie')
            .notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('Common_Name');
};
