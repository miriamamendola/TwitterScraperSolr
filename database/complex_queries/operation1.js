/*
    1. AVERAGE SENTIMENT PER TREND
    For each trend, select all the tweets associated with the trend and show the
    sentiment obtained as the average of the sentiment of the selected tweets.
*/

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

trends = db.getCollection('Trends').find({});

trends.forEach(function (trend) {

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
            // print the trend name and the average sentiment
            $group: {
                _id: {
                    name: '$name',
                    location: '$location',
                    date: '$date'
                },
                sentiment: {
                    $avg: '$tweetsData.sentiment'
                }
            }
        }
    ]);

    printjson(result.toArray());

});



