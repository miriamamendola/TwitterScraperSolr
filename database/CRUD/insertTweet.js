db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

const trend = db.Trends.findOne({ _id: "6543cb8f825f3a0c441ce76c" })

if (trend == null) {

    print("Trend doesn't exist.")

} else {

    const user = db.Users.findOne({ username: "@johndoe" })

    if (user == null) {

        print("User doesn't exist.")

    } else {

        id = "6543cb95825f3a0c441ce76e"

        // tweet to insert
        const tweet = {
            _id: id,
            username: "@johndoe",
            name: "John Doe",
            text: "AI is the future.",
            replies: 0,
            retweets: 0,
            likes: 0,
            shares: 0,
            sentiment: 0.2,
            url: "https://twitter.com/johndoe/status/1",
            trends: [trend._id],
            user_id: user._id
        }

        // insert tweet
        db.Tweets.insertOne(tweet)

        // insert tweet id in the user's tweets array
        db.Users.updateOne(
            { _id: user._id },
            { $push: { tweets: id } }
        )

        // insert tweet id in the trend's tweets array
        db.Trends.updateOne(
            { _id: trend._id },
            { $push: { tweets: id } }
        )

        print("Tweet inserted successfully.")
        
    }

}