const express = require("express");
const mongoose = require('mongoose');
const bodyParse = require("body-parser");
const passport = require("passport")
const app = express();

// 引入users.js
const users = require('./routes/api/users');
const profile = require('./routes/api/profiles');

// 链接MongoDB数据库 DB config
const db = require('./config/keys').mongoURI;
mongoose.connect(db,{ useNewUrlParser: true  })
.then(() => {
    console.log('mongodo connnet');
})
.catch(err => {
    console.log(err);
});

// 使用body-parse中间件
app.use(bodyParse.urlencoded({extended: false}));
app.use(bodyParse.json());

// 使用中间件实现允许跨域
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    next();
});

// passport 初始化
app.use(passport.initialize());

require("./config/passport")(passport);

// 使用routes
app.use("/api/users", users);
app.use('/api/profile', profile);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server is run ${port}`);
})
