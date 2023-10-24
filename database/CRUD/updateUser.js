db = connect("localhost:27017")

// connect to pre-existing database Twitter
db = db.getSiblingDB('Twitter')

// get the user @johndoe
const user = db.Users.findOne({username: "@johndoe"})

if (user == null) {
    print("User doesn't exist.")
    quit()
}

// update the user's bio
db.Users.updateOne(
    { _id: user._id },
    { $set: { bio: "I'm a programmer and a data scientist." } }
)

print("User updated successfully.")