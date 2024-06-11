// server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/link-preview", async (req, res) => {
  const { url } = req.query;
  try {
    const response = await axios.get(url);
    const html = response.data;

    // Simple example of parsing metadata (use a library like cheerio for production)
    const titleMatch = html.match(/<title>([^<]*)<\/title>/);
    const title = titleMatch ? titleMatch[1] : "No title found";
    const descriptionMatch = html.match(
      /<meta name="description" content="([^"]*)"/
    );
    const description = descriptionMatch
      ? descriptionMatch[1]
      : "No description found";
    const imageMatch = html.match(
      /<meta property="og:image" content="([^"]*)"/
    );
    const image = imageMatch ? imageMatch[1] : "No image found";

    res.json({ title, description, image });
  } catch (error) {
    res.status(500).json({ error: "Error fetching metadata" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
