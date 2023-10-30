/*
    For each trend, select all the tweets associated with the trend and show the
    sentiment obtained as the average of the sentiment of the selected tweets.
*/

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

db.getCollection('Trends').aggregate(
    [
        { $match: { name: '#matthewperry' } },
        { $unwind: { path: '$tweets' } },
        {
            $lookup: {
                from: 'Tweets',
                localField: 'tweets',
                foreignField: '_id',
                as: 'tweetsData'
            }
        },
        { $unwind: { path: '$tweetsData' } },
        {
            $group: {
                _id: '$_id',
                averageSentiment: {
                    $avg: '$tweetsData.sentiment'
                }
            }
        }
    ],
    { maxTimeMS: 60000, allowDiskUse: true }
);