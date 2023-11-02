db = connect("localhost:27017")

// connect to pre-existing database Twitter
db = db.getSiblingDB('Twitter')

// trend to insert
today = new Date().toString();
id = ObjectId().toString().match(/ObjectId\("(.+)"\)/)[1];

const trend = {
    _id: id,
    name: "AI",
    date: today,
    location: "Worldwide",
    url: "https://twitter.com/search?q=AI&src=typed_query"
}

if (db.Trends.findOne({trending_topic: "AI", location: "Worldwide", date: today}) != null) {
    print("Trend already exists.")
    quit()
}

// insert trend/
db.Trends.insertOne(trend)

// print success message
print("Trend inserted successfully.")
