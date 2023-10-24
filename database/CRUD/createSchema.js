db = connect("localhost:27017")

// create database Twitter
db = db.getSiblingDB('Twitter')

// drop all the collections
db.dropDatabase()

// create the collections

// create collection 'Trends'
db.createCollection('Trends', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id", "trending_topic", "date", "location"],
            properties: {
                trending_topic : {
                    bsonType: "string",
                    description: "Name of the trending topic. Required.",
                },
                location : {
                    bsonType: "string",
                    description: "Location of the trending topic. Required.",
                },
                date : {
                    bsonType: "date",
                    description: "Date of the trending topic. Required.",
                }
            }
        }
    }
})
print("Trends' schema created.")

// create collection 'Users'
db.createCollection('Users', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id", "username", "verified","following", "followers"],
            properties: {
                username : {
                    bsonType: "string",
                    description: "Username of the user. Required.",
                },
                verified : {
                    bsonType: "bool",
                    description: "Whether the user is verified or not. Required.",
                },
                following : {
                    bsonType: "int",
                    description: "Number of users the user is following. Required.",
                },
                followers : {
                    bsonType: "int",
                    description: "Number of users following the user. Required.",
                }
            }
        }
    }
})
print("Users' schema created.")

// create collection 'Tweets'
db.createCollection('Tweets', {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["_id", "username", "tweet", "replies", "retweets", "likes", "shares", "sentiment"],
            properties: {
                username : {
                    bsonType: "string",
                    description: "Username of the tweet. Required.",
                },
                tweet : {
                    bsonType: "string",
                    description: "Tweet. Required.",
                },
                replies : {
                    bsonType: "int",
                    description: "Number of replies to the tweet. Required.",
                },
                retweets : {
                    bsonType: "int",
                    description: "Number of retweets of the tweet. Required.",
                },
                likes : {
                    bsonType: "int",
                    description: "Number of likes of the tweet. Required.",
                },
                shares : {
                    bsonType: "int",
                    description: "Number of shares of the tweet. Required.",
                },
                sentiment : {
                    bsonType: "string",
                    description: "Sentiment of the tweet. Required.",
                }
            }
        }
    }
})
print("Tweets' schema created.")

// create index for 'Trends' on 'trending_topic' and 'location'
db.Trends.createIndex({trending_topic: 1, location: 1}, {unique: true})
print("Index created for Trends.")

// create index for 'Users' on 'username'
db.Users.createIndex({username: 1}, {unique: true})
print("Index created for Users.")