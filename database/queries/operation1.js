/*
    1. AVERAGE SENTIMENT PER TREND  (operation1.js)
    For each trend, select all the tweets associated with the trend and show the
    sentiment obtained as the average of the sentiment of the selected tweets.
*/

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

// iterate over all the trends in the database
trends = db.getCollection('Trends').find({});
trends.forEach(function (trend) {
    // for each trend aggregate the pipeline
    result = db.getCollection('Trends').aggregate([
        {
            $match: {
                name: trend.name,
                location: trend.location,
                date: trend.date
            }
        }, {
            $unwind: {
                path: '$tweets'
            }
        }, {
            $lookup: {
                from: 'Tweets',
                localField: 'tweets',
                foreignField: '_id',
                as: 'tweetsData'
            }
        }, {
            $unwind: {
                path: '$tweetsData'
            }
        }, {
            $group: {
                _id: '$_id',
                averageSentiment: {
                    $avg: '$tweetsData.sentiment'
                }
            }
        }
    ]);

    printjson(result.toArray());

});



