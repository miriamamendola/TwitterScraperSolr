db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

user = db.Users.findOne({ username: "@johndoe" })

if (user == null) {

    print("User doesn't exist.")
    
} else {

    if (user.tweets == null) {

        print("User doesn't have any tweets.")

    } else {

        user.tweets.forEach(tweet_id => {

            tweets = db.Tweets.find({ _id: tweet_id })

            tweets.forEach(tweet => {

                tweet.trends.forEach(trend_id => {
                    db.Trends.updateOne(
                        { _id: trend_id },
                        { $pull: { tweets: tweet._id } }
                    )
                })

                db.Tweets.deleteOne(
                    { _id: tweet._id }
                )
            })

        })
    }

}

db.Users.deleteOne(
    { username: user.username }
)

print("User deleted successfully.")