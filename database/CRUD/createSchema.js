db = connect("localhost:27017")

// create database Twitter
db = db.getSiblingDB('Twitter')

// drop all the collections
db.dropDatabase()

// create the collections

// create collection 'Users'
db.createCollection('Users', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            title: "Users object validation",
            required: ["_id", "username", "verified", "following", "followers"],
            properties: {
                username: {
                    bsonType: "string",
                    description: "Username of the user. Required.",
                },
                verified: {
                    bsonType: "bool",
                    description: "Whether the user is verified or not. Required.",
                },
                following: {
                    bsonType: "int",
                    description: "Number of users the user is following. Required. It must be greater than or equal to 0.",
                    minimum: 0,
                },
                followers: {
                    bsonType: "int",
                    description: "Number of users following the user. Required. It must be greater than or equal to 0.",
                    minimum: 0,
                }
            }
        }
    }
})
print("Users' schema created.")

// create collection 'Trends'
db.createCollection('Trends', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id", "url", "name", "location"],
            properties: {
                url: {
                    bsonType: "string",
                    description: "URL of the trend. Required.",
                },
                name: {
                    bsonType: "string",
                    description: "Name of the trend. Required.",
                },
                location: {
                    bsonType: "string",
                    description: "Location of the trend. Required.",
                }
            }
        }
    }
})

print("Trends' schema created.")

// create collection 'Tweets'
db.createCollection('Tweets', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id", "url", "username", "text", "retweets", "likes", "shares", "sentiment"],
            properties: {
                url: {
                    bsonType: "string",
                    description: "URL of the tweet. Required.",
                },
                username: {
                    bsonType: "string",
                    description: "Username of the user who tweeted. Required.",
                },
                text: {
                    bsonType: "string",
                    description: "Text of the tweet. Required.",
                },
                retweets: {
                    bsonType: "int",
                    description: "Number of retweets. Required. It must be greater than or equal to 0.",
                    minimum: 0,
                },
                likes: {
                    bsonType: "int",
                    description: "Number of likes. Required. It must be greater than or equal to 0.",
                    minimum: 0,
                },
                shares: {
                    bsonType: "int",
                    description: "Number of shares. Required. It must be greater than or equal to 0.",
                    minimum: 0,
                },
                sentiment: {
                    bsonType: "double",
                    description: "Sentiment of the tweet. Required.",
                }
            }
        }
    }
})
print("Tweets' schema created.")

// create index for 'Trends' on 'name', 'date', 'location' and rename to name_date_location
db.Trends.createIndex({ name: 1, date: 1, location: 1 }, {unique : true, name : "name_date_location_index"})
print("Index created for Trends.")

// create index for 'Users' on 'username'
db.Users.createIndex({ username: 1 }, {unique : true, name : "username_index"})
print("Index created for Users.")