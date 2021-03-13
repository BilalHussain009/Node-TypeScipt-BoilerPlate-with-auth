import express from 'express';
//Initialize Data Base
require('./database/mongoose')

const userRouter = require("./routers/users")
const app = express();
const port = process.env.PORT||3000
//Allowing Cors requests to the server
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    next();
  });
app.use(express.json())
app.use(userRouter)
app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});