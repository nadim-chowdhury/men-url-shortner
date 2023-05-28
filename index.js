const express = require("express");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const { connectToMongoDB } = require("./conndectDb");

const app = express();
const PORT = 8000;

connectToMongoDB(
  "mongodb+srv://lieonadim:admin@cluster0.ilacjpy.mongodb.net/url-shortner?retryWrites=true&w=majority"
).then(() => console.log("MongoDB Connected"));

app.use(express.json());
app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamps: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log("Server Start on http://localhost:8000");
});
