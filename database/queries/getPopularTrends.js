db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

minTweets = 5

print("Trends with more than " + minTweets + " tweets:\n")

db.Trends.find({}).forEach(function (trend) {

    if (trend.tweets.length > minTweets) {

        print("Trend: " + trend.name + " has " + trend.tweets.length + " tweets\n")

    }

})