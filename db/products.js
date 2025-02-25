const client = require('./client.js');

const createProduct = async (productName, productDescription) => {
  try {
    // console.log('inside create product');
    const { rows } = await client.query(`
    INSERT INTO products (name, description)
    VALUES ( '${productName}', '${productDescription}')
    RETURNING *;
      `)
    const product = rows[0]
    return product;
  } catch (err) {
    console.log(err);
  }
}

const getAllProducts = async() => {
  try {
    const { rows: retrievedProducts } = await client.query(`
      SELECT * FROM products;
    `);

    return retrievedProducts;
  } catch(err) {
    console.log(err);
  }
}

const getProductById = async(productId) => {
  try {
    const { rows } = await client.query(`
      SELECT * FROM products WHERE id=${productId};
    `);

    const singleProduct = rows[0];
    return singleProduct;
  } catch(err) {
    console.log(err);
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById
}