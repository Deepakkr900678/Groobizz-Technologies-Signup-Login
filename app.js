const express = require("express");
const loginRoutes = require("./routes/login");
var jwt = require('jsonwebtoken');
const secret = "RESTAPI";

const connect = require("./connection/connect");

//CRUD--- Create Read Update Delete
const app = express();

app.use("/api/v1/posts", (req, res, next) => {
    if(req.headers.authorization){
    const token = req.headers.authorization;
    console.log("valied token")
    if (token) {
        // verify a token symmetric
        jwt.verify(token, secret, function (err, decoded) {
            if(err){
                return res.status(403).json({
                    status: "failed",
                    message: "Invalid token"
                })
            }
            req.user = decoded.data;
            next();
        });
    }else{
        return res.status(403).json({
            status: "failed",
            message: "Invalid token"
        })
    }
    
}else{
    return res.status(403).json({
        status: "Failed",
        message: "Not authenticated user"
    });
}
})

app.use("/api/v1", loginRoutes);

app.get("/", (req, res) => {
    res.send("Ok");
})

app.listen(3500, () => console.log("The server is up at 3500 port"));