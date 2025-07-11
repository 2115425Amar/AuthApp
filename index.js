const express =require("express");
const app = express();


require("dotenv").config();
const PORT = process.env.PORT || 3000

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());

require("./config/database").connect();

//route import and mount
const user = require("./routes/User");
app.use("/api/v1",user);

// Swagger setup
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, ()=>{
    console.log(`server started at port ${PORT}`);
});

app.get("/",(req,res)=>{
    res.send("This Is HomePage");
})
module.exports = app;