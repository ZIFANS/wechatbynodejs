const express = require("express");
const mongoose = require('mongoose');
const bodyParse = require("body-parser");
const app = express();

// 引入users.js
const users = require('./routes/api/users');

// 链接MongoDB数据库 DB config
const db = require('./config/keys').mongoURI;
mongoose.connect(db, {useUnifiedTopology: true})
.then(() => {
    console.log('mongodo connnet');
})
.catch(err => {
    console.log(err);
});

// 使用body-parse中间件
app.use(bodyParse.urlencoded({extended: false}));
app.use(bodyParse.json());


app.get("/", (req, res) => {
    res.send('hello wrold111');
})

// 使用routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server is run ${port}`);
})