try:
    import pymongo
except ImportError:
    print("pymongo is not installed. Please install it using 'pip install pymongo'")
    exit(1)

import json, os

client = pymongo.MongoClient("mongodb://localhost:27017/")

db = client["Twitter"]

# read the json file from data/trends/*.json and insert them into the database in the collection "Trends"
for filename in os.listdir("database/data/trends"):
    if filename.endswith(".json"):
        with open("database/data/trends/" + filename, "r") as f:
            data = json.load(f)
            db["Trends"].insert_many(data)
            print("Inserted", len(data), "documents into the collection 'Trends'")

# read the json file from data/tweets/*.json and insert them into the database in the collection "Tweets"
for filename in os.listdir("database/data/tweets"):
    if filename.endswith(".json"):
        with open("database/data/tweets/" + filename, "r") as f:
            data = json.load(f)
            db["Tweets"].insert_many(data)
            print("Inserted", len(data), "documents into the collection 'Tweets'")

# read the json file from data/users/*.json and insert them into the database in the collection "Users"
for filename in os.listdir("database/data/users"):
    if filename.endswith(".json"):
        with open("database/data/users/" + filename, "r") as f:
            data = json.load(f)
            db["Users"].insert_many(data)
            print("Inserted", len(data), "documents into the collection 'Users'")

print("Done")