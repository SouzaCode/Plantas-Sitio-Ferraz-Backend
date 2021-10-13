
exports.up = function (knex) {
    return knex.schema.createTable('User', function (table) {
        table.increments("id_user").primary();
        table.text("profile_image");
        table.string("name").notNullable();
        table.string("email").notNullable();
        table.string("hash_password").notNullable();
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('User');
};
