db = connect("localhost:27017")
db = db.getSiblingDB('Twitter')

db.Tweets.aggregate([
    {
        $group: {
            _id: "$text",
            uniqueIds: { $addToSet: "$_id" },
            count: { $sum: 1 }
        }
    },
    {
        $match: {
            count: { $gte: 2 }
        }
    }
]).forEach(function (tweet) {
    tweet.uniqueIds.shift()
    tweet.uniqueIds.forEach(function (id) {
        db.Users.update({ tweets: id }, { $pull: { tweets: id } })
        db.Trends.update({ tweets: id }, { $pull: { tweets: id } })
        db.Tweets.deleteOne({ _id: id })
    })
});

db.Tweets.aggregate([
    {
        $unwind: "$comments"
    },
    {
        $group: {
            _id: "$_id",
            comments: { $addToSet: "$comments.text" }
        }
    }
]).forEach(function (tweet) {
    db.Tweets.updateOne(
        { _id: tweet._id },
        { $set: { comments: tweet.comments } }
    );
    db.Users.update(
        { tweets: tweet._id },
        { $pull: { tweets: tweet._id } }
    );
});
