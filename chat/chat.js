const knex = require("knex");

class Messages {
    constructor(tableName, dbConfig) {
      (this.table = tableName), (this.knex = knex(dbConfig));
  
      this.knex.schema
        .hasTable(this.table)
        .then((exists) => {
          if (!exists) {
            return this.knex.schema.createTable(this.table, (table) => {
              table.increments("id").notNullable().primary();
              table.string("username", 100).notNullable();
              table.string("message").notNullable();
              table.string("time", 50).notNullable();
            });
          }
        })
        .catch((err) => console.log("Error: ", err));
    }

    async newMessage(newMessage){
        try {
            await this.knex(this.table).insert(newMessage)
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    async getMessages(){
        try {
            const messages = await this.knex
             .from(this.table)
             .select('*');
            return messages; 
        } catch (error) {
            console.log("Error: ", error);
        } 
    }
}

module.exports = Messages;