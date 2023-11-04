db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

users = db.Users.find({}).toArray()

users.sort(function (a, b) {
    return a.age - b.age
})

print("The eldest user is: " + users[0].username + " which " + users[0].joined_date)







