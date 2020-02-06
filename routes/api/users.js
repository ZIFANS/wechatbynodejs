// login and register
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');     // 用于密码加密的包
const jwt = require('jsonwebtoken');
const gravatar = require("gravatar");   // 用于获取头像的包
const keys = require("../../config/keys");
const passport = require("passport");

// 引入User模型
const User = require('../../models/User');

// $route GET api/users/test
// @desc 返回的请求的json数据
// @access public
router.get("/test", (req, res) => {
    res.json({ msg: 'login works' })
});

// $route POST api/users/register
// @desc 返回的请求的json数据
// @access public
router.post("/register", (req, res) => {
    //console.log(req.body);
    // 查询数据库中是否拥有邮箱
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.status(400).json({ email: '邮箱已被注册' })
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

                bcrypt.genSalt(10, function (err, salt) {
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
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json( '用户不存在');
            }
            // 密码匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const rule = { id: user.id, name: user.name, avatar: user.avatar };                        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            if (err) throw err;
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        });
                        //res.json({msg: '成功'});
                    } else {
                        return res.status(404).json('密码错误' );
                    }
                })
        })
});

// $route  GET api/users/current
// @desc   return current user
// @access Private
router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar
        });
    }
);

module.exports = router;