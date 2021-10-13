
exports.up = function (knex) {
    return knex.schema.createTable('Plant', function (table) {
        table.string("id_plant").primary();
        table.integer("fk_id_specie")
            .references('id_specie')
            .inTable('Specie')
            .notNullable();
        table.integer("fk_id_user")
            .references('id_user')
            .inTable('User')
            .notNullable();
        table.string("observation");
        table.int("day_planted");
        table.int("month_planted");
        table.int("year_planted").notNullable();
        table.timestamp("date_death");
        table.decimal("latitude");
        table.decimal("longitude");
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('Plant');
};
