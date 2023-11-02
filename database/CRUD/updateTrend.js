db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

const trend = db.Trends.findOne({_id: "6543cb8f825f3a0c441ce76c"})

if (trend == null) {

    print("Trend doesn't exist.")

} else {

    db.Trends.updateOne(
        { _id: trend._id },
        { $set: { date: new Date() } }
    )

    print("Trend updated successfully.")

}