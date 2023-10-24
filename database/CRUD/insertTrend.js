db = connect("localhost:27017")

// connect to pre-existing database Twitter
db = db.getSiblingDB('Twitter')

// trend to insert
const trend = {
    trending_topic: "AI",
    date: new Date(),
    location: "Worldwide",
    url: "https://twitter.com/search?q=AI&src=typed_query"
}

if (db.Trends.findOne({trending_topic: "AI", location: "Worldwide"}) != null) {
    print("Trend already exists.")
    quit()
}

// insert trend
db.Trends.insertOne(trend)

// print success message
print("Trend inserted successfully.")
