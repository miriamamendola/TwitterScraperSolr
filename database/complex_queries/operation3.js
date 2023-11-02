/*
    3. TREND DIFFUSION DEGREE
    Given a certain trend, identify all the users who have published tweets that belong to it and based on their number of 
    followers identify how many people have been reached by the trend, as the sum of the number of followers (which is 
    clearly an approximation)
*/

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

trendName = "#Halloween"

result = db.getCollection('Tweets').aggregate(
    [
        {
            $match: {
                text: {
                    $regex: '#Halloween',
                    $options: 'i'
                }
            }
        }, {
            $lookup: {
                from: 'Users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'usersData'
            }
        }, {
            $unwind: {
                path: '$usersData'
            }
        }, {
            $group: {
                _id: '$_id',
                usersReached: {
                    $sum: {
                        $subtract: [
                            '$usersData.followers', 1
                        ]
                    }
                }
            }
        }
    ]
)

printjson(result.toArray())



