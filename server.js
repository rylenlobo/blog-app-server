const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Enable CORS with the base domain from the environment variable
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://blog-app-eight-ecru-27.vercel.app/"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@blog.tytr0sc.mongodb.net/blog?retryWrites=true&w=majority`
  )
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/blog", require("./routes/blog"));

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on http://localhost:5000")
);
