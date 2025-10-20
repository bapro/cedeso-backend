import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/my-ip", async (req, res) => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    res.send(`My public IP is: ${data.ip}`);
  } catch (err) {
    res.send(err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
