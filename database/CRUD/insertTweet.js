db = connect("localhost:27017")

// connect to pre-existing database Twitter
db = db.getSiblingDB('Twitter')

// get the _id of the trend Covid-19 Worldwide (which was inserted in insertTrend.js)
const trend_id = db.Trends.findOne({trending_topic: "AI", location: "Worldwide"})._id

if (trend_id == null) {
    print("Trend doesn't exist.")
    quit()
}

const user_id = db.Users.findOne({username: "@johndoe"})._id

if (user_id == null) {
    print("User doesn't exist.")
    quit()
}

const _id = ObjectId()
// tweet to insert
const tweet = {
    _id : _id,
    username: "@johndoe",
    name: "John Doe",
    tweet: "AI is the future.",
    replies: 0,
    retweets: 0,
    likes: 0,
    shares: 0,
    url: "https://twitter.com/johndoe/status/1",
    trend_id: trend_id,
    user_id: user_id
}

// insert tweet
db.Tweets.insertOne(tweet)

// insert tweet id in the user's tweets array
db.Users.updateOne(
    { _id: user_id },
    { $push: { tweets: _id } }
)

print("Tweet inserted successfully.")