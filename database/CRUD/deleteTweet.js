db = connect("localhost:27017")

// connect to pre-existing database Twitter
db = db.getSiblingDB('Twitter')

// delete the tweet with ObjectId 65378054375448a4cdb0d929
if (db.Tweets.findOne({_id: ObjectId("65378054375448a4cdb0d929")}) == null) {
    print("Tweet doesn't exist.")
    quit()
}

// find the user who wrote the tweet and remove the object id of this tweet from his/her tweets array
db.Users.updateOne(
    { username: "@johndoe" },
    { $pull: { tweets: ObjectId("65378054375448a4cdb0d929") } }

)

db.Tweets.deleteOne(
    { _id: ObjectId("65378054375448a4cdb0d929") }
)

print("Tweet deleted successfully.")