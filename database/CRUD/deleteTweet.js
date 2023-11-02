db = connect("localhost:27017")

// connect to pre-existing database Twitter
db = db.getSiblingDB('Twitter')

tweet = db.Tweets.findOne({ _id: "6543cb95825f3a0c441ce76e" })

if (tweet == null) {

    print("Tweet doesn't exist.")
    
} else {

    // find the user who wrote the tweet and remove the id of this tweet from his/her tweets array
    db.Users.updateOne(
        { _id: tweet.user_id },
        { $pull: { tweets: tweet._id } }
    )

    tweet.trends.forEach(trend => {
        // find the trend related to the tweet and remove the id of this tweet from its tweets array
        db.Trends.updateOne(
            { _id: trend },
            { $pull: { tweets: tweet._id } }
        )
    })

    db.Tweets.deleteOne(
        { _id: tweet._id }
    )

    print("Tweet deleted successfully.")

}