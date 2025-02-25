const client = require('./client.js');

const createUser = async( username, password) => {
  try{
// console.log('creating user');
await client.query(`
 INSERT INTO users (username, password)
 VALUES ( '${username}', '${password}')
 RETURNING *;
  `);
  }catch(err) {
    console.log(err);
  }
}

module.exports = {
  createUser
}