var Campground = require("../models/campground")
var Comment = require("../models/comment")

middlewareObj = {}

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    req.flash("error", "Please login First");
    res.redirect("/login")
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (!req.isAuthenticated()) res.redirect("back");
    else{
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) return console.error(err);
            if (comment.author.id.equals(req.user._id)){
                return next()
            }
            else {
                req.flash("error", "You don't have the permission");
                res.redirect("back");
            }
        })
    }
}

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (!req.isAuthenticated()) res.redirect("back");
    else{
        Campground.findById(req.params.id, (err, campground) => {
            if (err) return console.error(err);
            if (campground.author.id.equals(req.user._id)){
                return next()
            }
            else {
                req.flash("error", "You don't have the permission");
                res.redirect("back");
            }
        })
    }
}

module.exports = middlewareObj