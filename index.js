import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import cors from "cors";
import connectDB from "./utils/db.js";

//import all routes
import userRoutes from "./routes/user.routes.js";

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/arpan", (req, res) => {
  res.send("Arpan");
});

//connect to db
connectDB();

//user routes
app.use("/api/v1/users", userRoutes);

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
