db = connect("localhost:27017")

// connect to pre-existing database Twitter
db = db.getSiblingDB('Twitter')

// get the _id of the trend Covid-19 Worldwide (which was inserted in insertTrend.js)
const trend_id = db.Trends.findOne({trending_topic: "AI", location: "Worldwide"})._id

if (trend_id == null) {
    print("Trend doesn't exist.")
    quit()
}

// update the trend date to the current date
db.Trends.updateOne(
    { _id: trend_id },
    { $set: { date: new Date() } }
)

print("Trend updated successfully.")