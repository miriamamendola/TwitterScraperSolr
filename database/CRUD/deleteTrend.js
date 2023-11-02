db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

id = "6543cb8f825f3a0c441ce76c"

trend = db.Trends.findOne({ _id: id })

if (trend == null) {

    print("Trend doesn't exist.")

} else {

    if (trend.tweets == null) {

        print("Trend doesn't have any tweets.")

    } else {

        trend.tweets.forEach(tweet_id => {

            tweets = db.Tweets.find({ _id: tweet_id })

            tweets.forEach(tweet => {
                db.Users.updateOne(
                    { _id: tweet.user_id },
                    { $pull: { tweets: tweet._id } }
                )
            })

            db.Tweets.deleteOne(
                { _id: tweet_id }
            )

        })

    }

    db.Trends.deleteOne({ _id: id })

    print("Trend deleted successfully.")

}