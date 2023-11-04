
db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

db.Users.find({}).forEach(function (user) {

    print("User: " + user.username + "\n")

    user.tweets.forEach(function (tweet) {

        toPrint = db.Tweets.findOne({ _id: tweet })

        if (toPrint != null) {

            print("\tTweet: " + toPrint.text + "\n")

            if (toPrint.comments != null) {

                toPrint.comments.forEach(function (comment) {

                    print("\t\tComment: " + comment.text + "\n")

                })

            }   

            print("]\n")

        }

        comment = db.Tweets.findOne({ "comments._id": tweet });

        if (comment != null) {

            print("\t\tComment: " + comment.text + "\n")

        }

    })

})

