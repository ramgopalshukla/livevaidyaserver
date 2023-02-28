const express = require("express");
const colors = require("colors");
const moragan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
// const router= require()
const connectDB = require("./config/db");
const path= require('path')
dotenv.config();
// rest object

const app = express();
app.use(express.json());
app.use(moragan("dev"));
app.use(cors());

// middlewares

app.use("/api/v1/user", require("./routes/userroutes"));
app.use("/api/v1/admin", require("./routes/adminroutes"));
app.use("/api/v1/doctor", require("./routes/docterroutes"));


// static files

app.use(express.static(path.join(__dirname, '../Client/client/build')))




connectDB();

// listen port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`.bgMagenta.white);
 
});
