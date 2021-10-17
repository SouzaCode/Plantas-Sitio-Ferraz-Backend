
exports.up = function (knex) {
    return knex.schema.createTable('Diary', function (table) {
        table.increments("id_diary_entry").primary();
        table.string("annotation").notNullable();
        table.string("email").notNullable();
        table.string("hash_password").notNullable();
        table.string("fk_id_plant")
            .references('id_plant')
            .inTable('Plant')
            .notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('Diary');
};
