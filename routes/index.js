var express = require("express"),
router = express.Router(),
passport = require("passport");

const User = require("../models/user");

router.get("/", function(req, res){
    res.render("landing")
})

router.get("/register", function(req, res){
    res.render("register")
})

router.post("/register", function(req, res){
    var newuser = new User({username: req.body.username});
    User.register(newuser, req.body.password, function(err, user){
        if (err){
            req.flash("error", err.message);
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/apartments")
        })
    });
})

router.get("/login", function(req, res){
    res.render("login")
})

router.post("/login", passport.authenticate("local", {
    successRedirect : "/apartments",
    failureRedirect: "/login"
}))

router.get("/logout", function(req, res){
    req.logOut();
    req.flash("success", "You successfully logout");
    res.redirect("/apartments")
})

module.exports = router