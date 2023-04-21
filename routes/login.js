const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require("../models/users");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const secret = "RESTAPI";

router.use(bodyParser.json());

//Register the user into app

router.post("/register", body('email').isEmail(), body('name').isAlpha(),
    body('password').isLength({ min: 6, max: 16 }), async (req, res) => {
        
        try {
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, email, password } = req.body;
            //check whether user is already registered

            let user = await User.findOne({ email });

            if (user) {
                return res.status(401).json({
                    status: "Failed",
                    message: "User Already exists with the given email"
                });
            }

            bcrypt.hash(password, 10, async function (err, hash) {
                // Store hash in your password DB.
                // console.log(err, hash);
                if (err) {
                    return res.status(400).json({
                        status: "Failed",
                        message: err.message
                    });
                }

                const user = await User.create({
                    name: name,
                    email: email,
                    password: hash
                })
                return res.json({
                    status: "success",
                    message: "User Successfully Created",
                    user
                })
            });
        } catch (e) {
            res.status(500).json({
                status: "failed",
                message: e.message
            })
        }
        // user = await User.create(req.body);
        // res.json({
        //     "status": "Success",
        //     user

        // });
    })

//Login the user into app
router.post("/login", body('email').isEmail(), async (req, res) => {

    try {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                status: "Failed",
                message: "User doesnt exists"
            });
        }

        // Load hash from your password DB.
        bcrypt.compare(password, user.password, function (err, result) {
            // result == true
            if (err) {
                return res.status(401).json({
                    status: "Failed",
                    message: err.message
                });
            }
            if (result) {
                //token will be used to track the user for further operation
               const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: user._id
                  }, secret);

                    res.status(200).json({
                    status: "Success",
                    message: "Login Successful",
                    token
                });
            } else {
                return res.status(401).json({
                    status: "Failed",
                    message: "Invalid !! Please provide correct email and password"
                });
            }
        });

    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message
        })
    }
    // user = await User.create(req.body);
    // res.json({
    //     "status": "Success",
    //     user

    // });
})

module.exports = router;