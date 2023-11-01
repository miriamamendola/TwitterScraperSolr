/*
    4. USER COHERENCE SCORE
    For each user, group the tweets he wrote by the trends in the trends array and, for each cluster, assign the user a coherence score, 
    average the scores obtained 
*/

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

result = db.getCollection("Users").aggregate([
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
        $lookup: {
            from: "Trends",
            localField: "userTweets.trends",
            foreignField: "_id",
            as: "tweetTrends"
        }
    },
    {
        $unwind: "$tweetTrends"
    },
    {
        $group: {
            _id: {
                userId: "$_id",
                trendId: "$tweetTrends._id"
            },
            userTweets: { $push: "$userTweets" },
            coherenceScores: { $avg: "$userTweets.sentiment" } 
        }
    },
    {
        $group: {
            _id: "$_id.userId",
            coherenceScoresByUser: {
                $push: {
                    trendId: "$_id.trendId",
                    coherenceScore: "$coherenceScores"
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            userId: "$_id",
            coherenceScoresByUser: 1
        }
    }
]);

printjson(result.toArray())