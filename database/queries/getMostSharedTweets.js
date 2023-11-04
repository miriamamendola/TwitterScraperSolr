db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

tweets = db.Tweets.find({}).sort({shares: -1}).limit(10).toArray()

toPrint = tweets.map(function (tweet) {
    return {text: tweet.text, trend: db.Trends.findOne({_id: { $in: tweet.trends}}).name, shares: tweet.shares}
})

print("The 10 most shared tweets are: ")
printjson(toPrint)