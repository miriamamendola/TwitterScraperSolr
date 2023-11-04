db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

minFollowers = 1000

print("Users with more than " + minFollowers + " followers:\n")

db.Users.find({}).forEach(function (user) {

    if (user.followers > minFollowers) {

        print("User: " + user.username + " has " + user.followers + " followers and " + user.tweets.length + " tweets\n")

    }

})