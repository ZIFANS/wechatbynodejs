const expres = require("express");
const mongoose = require('mongoose');
const app = expres();

// 引入users
const users = require('./routes/api/users');

const db = require('./config/keys').mongoURI;
mongoose.connect(db, {useUnifiedTopology: true})
.then(() => {
    console.log('mongodo connnet');
})
.catch(err => {
    console.log(err);
});

app.get("/", (req, res) => {
    res.send('hello wrold111');
})

// 使用routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server is run ${port}`);
})