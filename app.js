var mongoose = require("mongoose"),
passport = require("passport"),
apartments = require("./routes/apartments"),
comments = require("./routes/comments"),
index = require("./routes/index"),
methodOverride = require('method-override')

const express = require("express"),
session = require("express-session"),
app = express(),
flash = require("connect-flash"),
User = require("./models/user"),
bodyParser = require("body-parser");
seedDB = require("./seed")

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.use(session({
    secret: "I love nana",
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/apartments", apartments);
app.use("/apartments/:id/comments", comments);
app.use("/", index)

app.listen(3000, function(){
    console.log("server running.")
})