/*
    Given a trend, select all the users that have published tweets that belong to it and for each of them, select the number of followers
    and the verified status
*/

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

db.getCollection('Trends').aggregate(
    [
        {
            '$match': {
                'text': {
                    '$regex': '#MatthewPerry',
                    '$options': 'i'
                }
            }
        }, {
            '$lookup': {
                'from': 'Users',
                'localField': 'user_id',
                'foreignField': '_id',
                'as': 'usersData'
            }
        }, {
            '$unwind': {
                'path': '$usersData'
            }
        }, {
            '$group': {
                '_id': '_id',
                'totUsers': {
                    '$sum': 1
                },
                'usersReached': {
                    '$sum': {
                        '$subtract': [
                            '$usersData.followers', 1
                        ]
                    }
                }
            }
        }
    ]
)


