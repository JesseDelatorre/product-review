const client = require('./client.cjs');

const createReview = async (review, productId, userId) => {
  try {
    const { rows: singleReview } = await client.query(`
     INSERT INTO reviews (review, product_id, user_id)
     VALUES ('${review}', '${productId}', '${userId}')
     RETURNING *;
      `)
    const newReview = singleReview[0];
    return newReview;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  createReview
}