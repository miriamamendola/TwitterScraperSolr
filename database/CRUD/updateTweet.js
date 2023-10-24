db = connect("localhost:27017")

// connect to pre-existing database Twitter
db = db.getSiblingDB('Twitter')

// update the tweet with ObjectId 65378054375448a4cdb0d929
if (db.Tweets.findOne({_id: ObjectId("65378054375448a4cdb0d929")}) == null) {
    print("Tweet doesn't exist.")
    quit()
}

db.Tweets.updateOne(
    { _id: ObjectId("65378054375448a4cdb0d929") },
    { $set: { likes: 10, shares: 2 } }
)

// insert sentiment in the tweet
db.Tweets.updateOne(
    { _id: ObjectId("65378054375448a4cdb0d929") },
    { $set: { sentiment: "positive" } }
)

print("Tweet updated successfully.")