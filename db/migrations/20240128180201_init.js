/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {

   return knex.schema.createTable('Repositories',(table)=>{
        table.increments('id').primary()
        table.string('Name').notNullable()

    })

  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
return knex.schema.dropTable('Repositories')

  
};
