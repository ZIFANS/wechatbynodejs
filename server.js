const express = require("express");
const mongoose = require('mongoose');
const bodyParse = require("body-parser");
const passport = require("passport")
const app = express();

// 引入users.js
const users = require('./routes/api/users');

// 链接MongoDB数据库 DB config
const db = require('./config/keys').mongoURI;
mongoose.connect(db,{ useNewUrlParser: true })
.then(() => {
    console.log('mongodo connnet');
})
.catch(err => {
    console.log(err);
});

// 使用body-parse中间件
app.use(bodyParse.urlencoded({extended: false}));
app.use(bodyParse.json());


// passport 初始化
app.use(passport.initialize());

require("./config/passport")(passport);

// 使用routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server is run ${port}`);
})