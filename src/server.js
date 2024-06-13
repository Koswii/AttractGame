const express = require("express");
const stripe = require("stripe")(
  "sk_test_51PQqwY09gFZMinIq2Ktr9A3FgkahEYy5rMu0nou0UhwTAoyU1W6Lc9MVgok8Va908IUqL9Ej8YAE1o2vWxjGjj5H00H7MBKQyO"
); // Replace with your actual secret key
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Function to calculate total unit amount
const calculateTotalUnitAmount = (lineItems) => {
  let totalAmount = 0;

  lineItems.forEach((item) => {
    totalAmount += item.price_data.unit_amount;
  });

  return totalAmount;
};

app.post("/create-check-out-session", async (req, res) => {
  const { product } = req.body;

  
  const line_items = product.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.ag_product_name,
        images: [item.productData.game_cover],
      },
      unit_amount: Math.round(item.totalPrice * 100), // Convert to cents
    },
    quantity: item.numberOfOrder,
  }));

  const totalUnitAmount = calculateTotalUnitAmount(line_items);
  const totalPayable = totalUnitAmount + ((4.5 / 100) * totalUnitAmount);
  console.log(totalPayable);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(totalPayable),
    currency: "usd",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    line_items: line_items,
  });
});
app.get("/success", (req, res) => {
  res.send("payment successfull");
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));
