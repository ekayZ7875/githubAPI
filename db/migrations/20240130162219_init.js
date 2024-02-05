/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {

    return knex.schema.createTable('Users_2',(table)=>{
        table.increments('id').primary()
        table.string('Username').notNullable()
        table.string('Password').notNullable()
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

    return knex.schema
    .dropTable('Users_1')
  
};
