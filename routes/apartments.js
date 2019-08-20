var express = require("express"),
router = express.Router();

const Campground = require("../models/campground"),
Comment = require("../models/comment"),
middleware = require("../middleware");


router.get("/", function(req, res){
    Campground.find({}, function(err, campground){
        if (err) return console.error(err);
        res.render("apartments/index", {campinfo: campground})
    })
})

router.post("/", middleware.isLoggedIn, function(req, res){
    var campName = req.body.campname;
    var campImg = req.body.campimg;
    var campDesc = req.body.campdesc;
    var campPrice = req.body.campprice;
    var author = {
        id: req.user,
        username: req.user.username,
    }
    newCamp = new Campground({"name": campName, "img": campImg, "desc": campDesc, "price": campPrice, "author": author});
    newCamp.save(function(err, newCamp){
        if (err) return console.error(err);
        newCamp.saveInfo();
        req.flash("success", "You successfully create a campground");
        res.redirect("/apartments");
    })
})

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("apartments/new");
})

router.get("/:id", function(req, res){
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, campground){
        if (err) return console.error(err);
        res.render('apartments/show', {campground: campground});
    })
})

router.get("/:id/edit", middleware.checkCampgroundOwnership ,function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) return console.error(err);
        res.render("apartments/edit", {campground: campground})
    })
})

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    var newCampground = req.body.campground;
    Campground.findByIdAndUpdate(req.params.id, newCampground, function(err, updatedCampground){
        if (err) return console.error(err);
        req.flash("success", "You successfully edited a campground");
        res.redirect("/apartments/" + req.params.id)
    })
})

router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, campgroundRemoved){
        if (err) return console.error(err);
        Comment.deleteMany({
            _id:{
                $in: campgroundRemoved.comments,
            }
        }, (err) => {
            if (err) return console.error(err);
            res.redirect("/apartments")
        })
    })
})

module.exports = router