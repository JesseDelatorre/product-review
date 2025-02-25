const { Client } = require('pg');
const client = new Client('postgres://localhost:5432/product_review');

module.exports = client;