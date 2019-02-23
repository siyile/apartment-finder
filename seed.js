var mongoose = require("mongoose"),
faker = require("faker");
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});

const Campground = require("./models/campground"),
Comment = require("./models/comment"),
User = require("./models/user");

const image = [
    "https://images.unsplash.com/photo-1550246520-56dedb9b4a1e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1550198162-f7fec1025d07?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1550145367-9a4c43eb3909?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1550236520-7050f3582da0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1550198376-c93d0d63a41c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1550619127-84e85e8f4912?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1550654969-72a721f33554?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1550684376-10d33ceba38e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1550749388-736d06e9c497?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1550728643-5cf103414b59?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
]

function seedDB(){
    Campground.deleteMany({}, function(err){
        if (err) return console.error(err);
        Comment.deleteMany({}, function(err){
            if (err) return console.error(err);
            console.log("deleted");
            User.find({}, (err, user) => {
                numCampground = getRandomInt(6, 12);
                for (var i = 0; i < numCampground; i++){
                    var author = getRandomUser(user);
                    Campground.create({
                        name: faker.address.city(),
                        desc: faker.lorem.paragraphs(),
                        price: faker.commerce.price(),
                        img: image[Math.floor(Math.random() * image.length)],
                        author: {
                            id: author.user,
                            username: author.username,
                        }
                    }, function(err, campground){
                        if (err) return console.error(err);
                        numComment = getRandomInt(3, 6);
                        var comments = [];
                        for (var j = 0; j < numComment; j++){
                            var commenter = getRandomUser(user);
                            const comment = new Comment({
                                author: {
                                    id: commenter.user,
                                    username: commenter.username,
                                },
                                text: faker.lorem.sentence(),
                                _id: new mongoose.Types.ObjectId(), 
                            })
                            comments.push(comment._id);
                            comment.save(function(err){
                                if (err) return console.error(err)
                            })
                        }
                        campground.comments = comments;
                        campground.save(function(err){
                            if (err) return console.error(err);
                            console.log("campground added")
                        })
                    })
                }
            })
        })
    })
}

// function seedDB(){
//     Campground.deleteMany({}, function(err){
//         if (err) return console.error(err);
//         Comment.deleteMany({}, function(err){
//             if (err) return console.error(err);
//         })
//     })
// }

function getRandomUser(user){
    var num = user.length,
    selected = getRandomInt(0, num);
    selectedUser = {
        username: user[selected].username,
        _id: user[selected]._id,
        user: user[selected]
    }

    return selectedUser
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = seedDB;