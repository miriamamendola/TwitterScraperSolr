db = connect("localhost:27017")

// connect to pre-existing database Twitter
db = db.getSiblingDB('Twitter')

// get the _id of the trend Covid-19 Worldwide (which was inserted in insertTrend.js)
dateToSearch = "Wed Nov 01 2023 23:51:59 GMT+0100 (Central European Standard Time)"
const trend = db.Trends.findOne({name: "AI", location: "Worldwide", date: dateToSearch})

if (trend == null) {
    print("Trend doesn't exist.")
    quit()
}

const trend_id = trend._id
const user = db.Users.findOne({username: "@johndoe"})

if (user == null) {
    print("User doesn't exist.")
    quit()
}

const user_id = user._id

const id = ObjectId().toString().match(/ObjectId\("(.+)"\)/)[1];
// tweet to insert
const tweet = {
    _id : id,
    username: "@johndoe",
    name: "John Doe",
    text: "AI is the future.",
    replies: 0,
    retweets: 0,
    likes: 0,
    shares: 0,
    sentiment: 0.2,
    url: "https://twitter.com/johndoe/status/1",
    trends: [trend_id],
    user_id: user_id
}

// insert tweet
db.Tweets.insertOne(tweet)

// insert tweet id in the user's tweets array
db.Users.updateOne(
    { _id: user_id },
    { $push: { tweets: _id.toString().match(/ObjectId\("(.+)"\)/)[1] } }
)

// insert tweet id in the trend's tweets array
db.Trends.updateOne(
    { _id: trend_id },
    { $push: { tweets: _id.toString().match(/ObjectId\("(.+)"\)/)[1] } }
)

print("Tweet inserted successfully.")