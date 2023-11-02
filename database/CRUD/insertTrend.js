db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

today = new Date().toString();

id = "6543cb8f825f3a0c441ce76c"

const trend = {
    _id: id,
    name: "AI",
    date: today,
    location: "Worldwide",
    url: "https://twitter.com/search?q=AI&src=typed_query"
}

if (db.Trends.findOne({ _id: id }) != null) {

    print("Trend already exists.")

} else {

    db.Trends.insertOne(trend)
    print("Trend inserted successfully.")

}