db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

const user = db.Users.findOne({ username: "@johndoe" })

if (user == null) {

    print("User doesn't exist.")

} else {

    db.Users.updateOne(
        { _id: user._id },
        { $set: { bio: "I'm a programmer and a data scientist." } }
    )

    print("User updated successfully.")

}