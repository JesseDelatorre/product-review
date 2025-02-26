const client = require('./db/client.cjs');
client.connect();


const express = require('express');
const { getAllProducts, getProductById } = require('./db/products.cjs');
const { createUser, loginAuth, tokenLogin } = require('./db/users.cjs');
const { getReviewsByProducts } = require('./db/reviews.cjs');

const app = express();
app.use(express.json());


app.get('/', (req, res, next) => {
  res.send('WELCOME!');
});

app.get('/api/v1/items', async (req, res, next) => {
  try {
    const allProducts = await getAllProducts();
    res.send(allProducts);
  } catch (err) {
    next(err);
  }
});

app.get('/api/v1/items/:id', async (req, res, next) => {
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

app.post( '/api/auth/register', async(req, res, next) => {
  const { username, password } = req.body;
  try{
   const newUser = await createUser(username, password);
   res.send(newUser);
  }catch(err) {
    res.send({ message: 'Wrong Username or Password' });
  }
});

app.post('/api/auth/login', async(req, res, next) => {
  const { username, password } = req.body;
  try {
    const token = await loginAuth(username, password);
    res.send({ token: token });
  } catch(err) {
    res.send({ message: 'Wrong Username or Password' });
  }
});


app.get('/api/items/:id/reviews', async(req, res, next) => {
  try {
    const { id } = req.params;
    const singleProductReviews = await getReviewsByProducts(id);
    res.send(singleProductReviews);
  } catch (err) {
    next(err);
  }
})

app.get('/api/auth/me', async(req, res, next) => {
  const { username, password } = req.body;
  try {
    const token = await loginAuth(username, password);
    const confirmedUser = await tokenLogin(token);
    res.send({ confirmedUser });
  } catch(err) {
    res.send({ message: 'Wrong Username or Password' });
  }
})


app.listen(process.env.PORT, () => {
  console.log(`listening on PORT ${process.env.PORT}`);
});