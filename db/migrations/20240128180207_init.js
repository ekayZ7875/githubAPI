/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
return  knex.schema.createTable('Commits',(table)=>{
    table.increments('id').primary()
    table.integer('Repo_id').unsigned().references('Repositories.id')
    table.string('SHA')
})


  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

    return knex.schema.dropTable('Commits')
  
};
