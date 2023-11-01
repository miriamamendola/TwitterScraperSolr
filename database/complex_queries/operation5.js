/*
    5. USER'S SENTIMENT PERCENTAGES
    Given a user, take the tweets he wrote and calculate the percentages of positive, negative and neutral sentiment tweets.
*/

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

username = "@SumeetMane24"

result = db.getCollection("Users").aggregate([
    {
        $match: {
            username: username
        }
    },
    {
        $lookup: {
            from: "Tweets",
            localField: "tweets",
            foreignField: "_id",
            as: "userTweets"
        }
    },
    {
        $unwind: "$userTweets"
    },
    {
        $group: {
            _id: "$_id",
            userTweets: { $push: "$userTweets" },
            positiveTweets: { $sum: { $cond: [{ $gt: ['$tweetsData.sentiment', 0.2] }, 1, 0] } },
            neutralTweets: {
                $sum: {
                    $cond: [{
                        $and: [{
                            $gte: [
                                '$tweetsData.sentiment', -0.2
                            ]
                        }, {
                            $lte: [
                                '$tweetsData.sentiment', 0.2
                            ]
                        }
                        ]
                    }, 1, 0]
                }
            },
            negativeTweets: { $sum: { $cond: [{ $lt: ['$tweetsData.sentiment', -0.2] }, 1, 0] } }
        }
    },
    {
        $project: {
            _id: 0,
            userId: "$_id",
            totalTweets: { $size: "$userTweets" },
            positivePercentage: { $multiply: [{ $divide: ["$positiveTweets", { $size: "$userTweets" }] }, 100] },
            negativePercentage: { $multiply: [{ $divide: ["$negativeTweets", { $size: "$userTweets" }] }, 100] },
            neutralPercentage: { $multiply: [{ $divide: ["$neutralTweets", { $size: "$userTweets" }] }, 100] },
        }
    }
])

printjson(result.toArray())