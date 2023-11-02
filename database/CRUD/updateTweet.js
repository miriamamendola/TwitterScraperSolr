db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

tweet = db.Tweets.findOne({_id: "6543cb95825f3a0c441ce76e"}) 

if (tweet == null) {

    print("Tweet doesn't exist.")

} else {

    db.Tweets.updateOne(
        { _id: tweet._id },
        { $set: { likes: 10, shares: 2 } }
    )
    
    print("Tweet updated successfully.")

}