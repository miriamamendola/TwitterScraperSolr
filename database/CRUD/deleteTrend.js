db = connect("localhost:27017")

// connect to pre-existing database Twitter
db = db.getSiblingDB('Twitter')

// find all the tweets related to the trend AI Worldwide
tweets = db.Tweets.find({trend_id: db.Trends.find({trending_topic: "AI", location: "Worldwide"})._id})
// for each tweet, get the ObjectId of the user who wrote it and find the user, then remove from the user's tweets array the ObjectId of the tweet
for (let i = 0; i < tweets.length; i++) {
    user_id = tweets[i].user_id
    db.Users.updateOne(
        { _id: user_id },
        { $pull: { tweets: tweets[i]._id } }
    )
}
// delete all the tweets related to the trend AI Worldwide
db.Tweets.deleteMany({trend_id: db.Trends.findOne({trending_topic: "AI", location: "Worldwide"})._id})

// delete the trend AI Worldwide
db.Trends.deleteOne({trending_topic: "AI", location: "Worldwide"})

print("Trend deleted successfully.")

