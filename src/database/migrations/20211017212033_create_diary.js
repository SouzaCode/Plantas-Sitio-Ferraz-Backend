
exports.up = function (knex) {
    return knex.schema.createTable('Diary', function (table) {
        table.increments("id_diary_entry").primary();
        table.string("annotation").notNullable();
        table.string("fk_id_plant")
            .references('id_plant')
            .inTable('Plant')
            .notNullable();
        table.timestamp("dt_entry").defaultTo(knex.fn.now())
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('Diary');
};
