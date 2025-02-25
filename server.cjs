const client = require('./db/client.cjs');
client.connect();


const express = require('express');
const { getAllProducts, getProductById } = require('./db/products.cjs');
const { createUser } = require('./db/users.cjs');
const app = express();






app.get('/api/v1/products', async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();
    res.send(allProducts);
  } catch (err) {
    next(err);
  }
});

app.get('/api/v1/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleProductById = await getProductById(id);
    if (!singleProductById) {
      next({ status: 400, message: ' Product Not Found' });
    }

    res.send(singleProductById);
  } catch (err) {
    next(err);
  }
});

app.post( '/api/v1/login', async(req, res, next) => {
  const { username, password } = req.body;
  try{
   const Login = await createUser();
   return Login;
  }catch(err) {
    res.send({ message: 'Wrong Username or Password' });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});