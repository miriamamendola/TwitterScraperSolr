db = connect("localhost:27017")

// connect to pre-existing database Twitter
db = db.getSiblingDB('Twitter')

// create a user who published a new tweet related to a trend
const user = {
    profile_name: "John Doe",
    username: "@johndoe",
    verified: false,
    bio: "I'm a programmer.",
    location: "Napoli",
    url: "johndoe.com",
    following: 192,
    followers: 2100000
}

if (db.Users.findOne({username: "@johndoe"}) != null) {
    print("User already exists.")
    quit()
}

// insert user
db.Users.insertOne(user)

print("User inserted successfully.")
