// login and register
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const gravatar = require("gravatar");

// 引入User模型
const User = require('../../models/User');

// $route GET api/users/test
// @desc 返回的请求的json数据
// @access public
router.get("/test", (req, res) => {
    res.json({msg: 'login works'})
});

// $route POST api/users/register
// @desc 返回的请求的json数据
// @access public
router.post("/register", (req, res) => {
    //console.log(req.body);
    // 查询数据库中是否拥有邮箱
    User.findOne({email: req.body.email})
        .then((user) => {
            if (user) {
                return res.status(400).json({email: '邮箱已被注册'})
            } else {
                // 头像
                const avatar = gravatar.url(req.body.email, {
                    s: "200",
                    r: "pg",
                    d: "mm"
                });
            
                // 输入的信息
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                      if (err) throw err;
            
                      newUser.password = hash;
            
                      newUser
                        .save()
                        .then(user => res.json(user));
                    });
                });

            }
    })
});


// $route  POST api/users/login
// @desc   返回token jwt passpord
// @access public

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // 查询数据库
    User.findOne({email})
        .then(user => {
            if (!user) {
                return res.status(404).json({email:'用户不存在'});
            }
            // 密码匹配
            bcrypt.compare(password, user.password)
                  .then(isMatch => {
                      if (isMatch) {
                          res.json({msg: '成功'});
                      } else {
                        return res.status(404).json({password:'密码错误'});
                      }
                  })
        })
})


module.exports = router;