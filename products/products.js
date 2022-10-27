const knex = require("knex");

class Products {
  constructor(tableName, dbConfig) {
    (this.table = tableName), (this.knex = knex(dbConfig));

    this.knex.schema
      .hasTable(this.table)
      .then((exists) => {
        if (!exists) {
          return this.knex.schema.createTable(this.table, (table) => {
            table.increments("id").notNullable().primary();
            table.string("name", 100).notNullable();
            table.string("url").notNullable();
            table.float("price").notNullable();
          });
        }
      })
      .catch((err) => console.log("Error: ", err));
  }

  async getProducts() {
    try {
      const products = await this.knex
        .from(this.table)
        .select("id", "name", "price", "url");
      return products;
    } catch (error) {
      console.log(error);
    } 
  }
  async saveProduct(product) {
    const { name, price, url } = product;
    if (!name || !price || !url) {
      return null;
    }

    const newProduct = {
      name,
      price,
      url,
    };

    try {
      await this.knex(this.table).insert(newProduct);
    } catch (error) {
      console.log(error);
    }
    return {
      product: newProduct,
    };
  }
}

module.exports = Products;