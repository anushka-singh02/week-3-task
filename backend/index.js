import express from "express";
import cors from "cors";
import Routes from "./route.js";
import { VerifyToken } from "./verifytoken.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", Routes);

app.use(VerifyToken)

app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});


app.listen(port,()=>{
    console.log('server started');
})