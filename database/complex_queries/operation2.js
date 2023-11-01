/* 
    2. SENTIMENT PERCENTAGES
    For each today's trend, select all the tweets that belong to it and for each value of sentiment that the tweet can assume,
    print the percentage of them that obtained that particular sentiment.
 */

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

// iterate over all the trends inserted today
trends = db.getCollection('Trends').find({
    date: {
        $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
        $lt: new Date(new Date().setHours(23, 59, 59))
    }
});

trends.forEach(function (trend) {
    result = db.getCollection('Trends').aggregate(
        [
            {
                $match: {
                    name: trend.name,
                    location: trend.location,
                    date: trend.date
                }
            }, {
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
                    'totalTweets': {
                        '$sum': 1
                    },
                    'positiveTweets': {
                        '$sum': {
                            '$cond': [
                                {
                                    '$gt': [
                                        '$tweetsData.sentiment', 0.2
                                    ]
                                }, 1, 0
                            ]
                        }
                    },
                    'neutralTweets': {
                        '$sum': {
                            '$cond': [
                                {
                                    '$and': [
                                        {
                                            '$gte': [
                                                '$tweetsData.sentiment', -0.2
                                            ]
                                        }, {
                                            '$lte': [
                                                '$tweetsData.sentiment', 0.2
                                            ]
                                        }
                                    ]
                                }, 1, 0
                            ]
                        }
                    },
                    'negativeTweets': {
                        '$sum': {
                            '$cond': [
                                {
                                    '$lt': [
                                        '$tweetsData.sentiment', -0.2
                                    ]
                                }, 1, 0
                            ]
                        }
                    }
                }
            }, {
                '$project': {
                    'totalTweets': 1,
                    'positivePercentage': {
                        '$multiply': [
                            {
                                '$divide': [
                                    '$positiveTweets', '$totalTweets'
                                ]
                            }, 100
                        ]
                    },
                    'neutralPercentage': {
                        '$multiply': [
                            {
                                '$divide': [
                                    '$neutralTweets', '$totalTweets'
                                ]
                            }, 100
                        ]
                    },
                    'negativePercentage': {
                        '$multiply': [
                            {
                                '$divide': [
                                    '$negativeTweets', '$totalTweets'
                                ]
                            }, 100
                        ]
                    }
                }
            }
        ]
    );

    printjson(result.toArray());
});

