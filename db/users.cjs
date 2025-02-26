const client = require('./client.cjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const createUser = async (username, password) => {
  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const { rows } = await client.query(`
  INSERT INTO users (username, password)
  VALUES ($1, $2);
    `, [username, encryptedPassword]);
    const user = rows[0];
    return user;
  } catch (err) {
    console.log(err);
  }
}

const loginAuth = async (username, password) => {
  try {
    const { rows } = await client.query(`
      SELECT * FROM users 
      WHERE username='${username}';
    `);
    const user = rows[0];
    if(user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if(isPasswordMatch) {
        const token = await jwt.sign({ username: user.username }, process.env.JWT_SECRET);
        return token;
      } else {
        throw new Error('Wrong username or password');
      }
    } else {
      throw new Error('Wrong username or password');
    }
  } catch(err) {
    throw new Error('Wrong Username or Password');
  }
}

const tokenLogin = async(token) => {
  try {
    const verifyUser = await jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await client.query(`
      SELECT * FROM users WHERE username='${verifyUser.username}'
    `);
    const confirmedUser = rows[0];
    if(confirmedUser) {
      return { username: confirmedUser.username };
    } else {
      return { message: 'Bad Token' }
    }
  } catch(err) {
    throw err;
  }
}

module.exports = {
  createUser,
  loginAuth,
  tokenLogin
}