/*
    6. ENGAGEMENT METRICS COMPUTATION
    For each trend, compute the average number of likes, shares, retweets and comments that its posts have received
*/

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

result = db.getCollection("Trends").aggregate([
    {
        '$unwind': {
            'path': '$tweets'
        }
    }, {
        '$lookup': {
            'from': 'Tweets',
            'localField': 'tweets',
            'foreignField': '_id',
            'as': 'tweetsData'
        }
    }, {
        '$unwind': {
            'path': '$tweetsData'
        }
    }, {
        '$group': {
            '_id': '$_id',
            'name': {
                '$first': '$name'
            },
            'avgLikes': {
                '$avg': '$tweetsData.likes'
            },
            'avgShares': {
                '$avg': '$tweetsData.shares'
            },
            'avgRetweets': {
                '$avg': '$tweetsData.retweets'
            },
            'avgComments': {
                '$avg': {
                    '$size': '$tweetsData.comments'
                }
            }
        }
    }, {
        '$project': {
            '_id': 0,
            'name': 1,
            'avgLikes': 1,
            'avgShares': 1,
            'avgRetweets': 1,
            'avgComments': 1
        }
    }
])

printjson(result.toArray())