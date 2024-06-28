const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

//Linking routes folder and file
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transaction");
const aggregationRoutes = require("./routes/aggregation");

//Express App created
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//Routes
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/aggregation",  aggregationRoutes);

//Connecting to MongoDB using mongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen for request
    app.listen(process.env.PORT, () => {
      console.log(
        "Connected to the DB and listening on port",
        process.env.PORT
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });