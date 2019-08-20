var mongoose = require("mongoose"),
faker = require("faker");
mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});

const Campground = require("./models/campground"),
Comment = require("./models/comment"),
User = require("./models/user");

const image = [
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1523192193543-6e7296d960e4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1525953776754-6c4b7ee655ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1527465094057-db061fdbfaf7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1496180727794-817822f65950?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1486748719772-dac71e23eaa1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1482942034933-80911239f17e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1461828813484-4a99a0fddf40?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1469366379702-59bb9f45c11e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1416153716529-31b4f85a319e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1472835560847-37d024ebacdc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
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