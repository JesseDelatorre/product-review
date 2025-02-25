const client = require('./client.cjs');
const { createUser } = require('./users.cjs');
const { createProduct, getProductById } = require('./products.cjs');
const { createReview } = require('./reviews.cjs');

const dropTables = async () => {
  try {
    await client.query(`
     DROP TABLE IF EXISTS reviews;
     DROP TABLE IF EXISTS products;
     DROP TABLE IF EXISTS users; 
      `)
  } catch (err) {
    console.log(err);
  }
}

const createTable = async () => {
  try {
    // console.log('creating tables');
    await client.query(`
  CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  password VARCHAR(60)
  );

  CREATE TABLE  products(
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  description TEXT
  );

  CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  review TEXT NOT NULL,
  product_id INTEGER REFERENCES products(id),
  user_id INTEGER REFERENCES users(id)
  );
  `)
  } catch (err) {
    console.log(err);
  }
}

const syncAndSeed = async () => {
  try {
    await client.connect();
    console.log('connected to db');

    console.log('dropping tables');
    await dropTables();
    console.log('tables dropped');

    console.log('creating tables');
    await createTable();
    console.log('tables created');

    console.log('creating users');
    const jesse = await createUser('Jesse', 'kumiho');
    const griz = await createUser('Griz', 'grizyeah');
    const clozee = await createUser('Clozee', 'perfect');
    const wooli = await createUser('Wooli', 'saywooli');
    const subtronics = await createUser('Subtronics', 'sploinky');
    console.log('user created');

    console.log('creating products');
    const ddj1000 = await createProduct('DDJ-1000', 'A DJ controller that requires a laptop to use.');
    const opus = await createProduct('Pioneer Opus', 'A standalone DJ controller that only requires a usb with compatable formated music to use.');
    const usb = await createProduct('32GB USB', 'A USB compatable with standalone DJ controllers');
    const headphones = await createProduct('Headphones', 'Headphones to use with your DJ controller, high quality speakers for crystal clear sound while DJing');
    console.log('product created');

    console.log('creating review');
    await createReview('great product', usb.id, jesse.id);
    await createReview('I love playing mixes on this!', opus.id, griz.id);
    await createReview('Easy to use and set up', ddj1000.id, wooli.id);
    await createReview('Best headphones i have ever owned', headphones.id, subtronics.id);
    await createReview('My go to USB', usb.id, clozee.id);
    await createReview('Sound quality is crisp', headphones.id, jesse.id);
    console.log('review created');

    await client.end();
    console.log('D/C from db')
  } catch (err) {
    console.log(err);
  }
}

syncAndSeed();
