var express = require("express"),
router = express.Router({mergeParams: true});

const Campground = require("../models/campground"),
Comment = require("../models/comment"),
middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    var id = req.params.id;
    Campground.findById(id, function(err, campground){
        if (err) return console.error(err);
        res.render('comments/new', {campground: campground});
    })
})

router.post("/new", middleware.isLoggedIn, function(req, res){
    var id = req.params.id;
    Campground.findById(id, function(err, campground){
        if (err) return console.error(err);
        Comment.create(req.body.comment, function(err, comment){
            if (err) return console.error(err);
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save(); 
            campground.comments.push(comment);
            campground.save();
            req.flash("success", "You successfully create a comment");
            res.redirect("/campgrounds/" + campground._id)
        })
    })
})

router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) return console.error(err);
        res.render("comments/edit", {comment : comment, campground_id: req.params.id})
    })
})

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err) => {
        if (err) return console.error(err);
        req.flash("success", "You successfully edit a campground");
        res.redirect("/campgrounds/" + req.params.id)
    })
})

router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.deleteOne({_id: req.params.comment_id}, (err) => {
        if (err) return console.error(err);
        req.flash("success", "You successfully deleted a comment");
        res.redirect("/campgrounds/" + req.params.id);
    })
})

module.exports = router