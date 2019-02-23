var mongoose = require("mongoose");
const util = require("util");
const Comment = require('./comment');

campgroundSchema = mongoose.Schema({
    name: String,
    price: String,
    img: String,
    desc: String,
    comments: [
        {
            "type": mongoose.Schema.Types.ObjectId,
            "ref": "Comment",
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    }
});

campgroundSchema.methods.saveInfo = function(){
    var saveInfo = util.format('%s added', this.name);
    console.log(saveInfo);
}

module.exports = mongoose.model('Campground', campgroundSchema);