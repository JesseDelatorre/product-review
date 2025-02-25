const client = require('./client.cjs');

const createUser = async (username, password) => {
  try {
    const { rows } = await client.query(`
 INSERT INTO users (username, password)
 VALUES ( '${username}', '${password}')
 RETURNING *;
  `);
    const user = rows[0];
    return user;
  } catch (err) {
    console.log(err);
  }
}



module.exports = {
  createUser
}