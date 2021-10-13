
exports.up = function (knex) {
    return knex.schema.createTable('Plant_Photo', function (table) {
        table.increments("id_plant_photo").primary();
        table.text("img_plant").notNullable();
        table.integer("fk_id_plant")
            .references('id_plant')
            .inTable('Plant')
            .notNullable();
        table.integer("fk_id_user")
            .references('id_user')
            .inTable('User')
            .notNullable();
        table.timestamp("img_date").defaultTo(knex.fn.now());
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('Plant_Photo');
};
