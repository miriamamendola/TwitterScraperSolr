db = connect("localhost:27017")

// connect to pre-existing database Twitter
db = db.getSiblingDB('Twitter')

// delete all the tweets wrote by the user with username @johndoe
db.Tweets.deleteMany(
    { username: "@johndoe" }
)

// delete the user
db.Users.deleteOne(
    { username: "@johndoe" }
)

print("User deleted successfully.")