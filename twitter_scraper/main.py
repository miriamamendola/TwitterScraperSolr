from twitter_scraper import Twitter_scraper
from pymongo import MongoClient
from bson.objectid import ObjectId
from textblob import TextBlob
import datetime

def get_sentiment(text):
    blob = TextBlob(text)
    return blob.sentiment.polarity

if __name__ == "__main__":

    client = MongoClient()
    db = client["Twitter"]

    scraper = Twitter_scraper()

    login_time = 30
    scraper.get_page("https://twitter.com", login_time)

    num_scrolls = 60
    scroll_iterations = 10
    driver_wait_time = 1
    scroll_wait_time = 1

    trends_collection = db["Trends"]
    #trends_data = scraper.get_trends()
    trends_data = [{"trending_topic": "covid", "url": "https://twitter.com/search?q=%23covid&src=trend_click&vertical=trends", "date": datetime.datetime.now(), "number_of_posts": 1000, "location": "Worldwide"}]
    trends_collection.insert_many(trends_data)

    tweets_collection = db["Tweets"]
    tweets_data = []

    usernames_collection = db["Users"]
    usernames = set()

    for trend in trends_data:
        print("Getting tweets for {}...".format(trend["trending_topic"]))
        scraper.get_page(trend["url"], driver_wait_time)
        tweets_data = scraper.get_tweets(num_scrolls, scroll_iterations, driver_wait_time, scroll_wait_time)
        print("Getting comments...")
        scraper.get_comments(tweets_data, scroll_wait_time, driver_wait_time)
        # add the trend field to each tweet containing the ObjectId of the trend
        for tweet in tweets_data:
            tweet["trend_id"] = trend["_id"]
            # add the username to the set of usernames if it is not already in the set
            if tweet["username"] not in usernames:
                usernames.add(tweet["username"])
                # find the user by username, removing the @ symbol
                scraper.get_page("https://twitter.com/{}".format(tweet["username"].replace("@","")), driver_wait_time)
                user = scraper.get_user()
                # insert the user into the usernames collection
                if type(user) == dict:
                    usernames_collection.insert_one(user)
                    tweet["user_id"] = user["_id"]
                # repeat the process for the writers of the comments
                if "comments" in tweet:
                    for comment in tweet["comments"]:
                        if comment["username"] not in usernames:
                            usernames.add(comment["username"])
                            scraper.get_page("https://twitter.com/{}".format(comment["username"].replace("@","")), driver_wait_time)
                            user = scraper.get_user()
                            if type(user) == dict:
                                usernames_collection.insert_one(user)
                                comment["user_id"] = user["_id"]
                        else: 
                            user = usernames_collection.find_one({"username": comment["username"]})
                            comment["user_id"] = user["_id"]
                        # insert the comment into the tweets array of the user
                        comment["_id"] = ObjectId()
                        usernames_collection.update_one({"_id": user["_id"]}, {"$push": {"tweets": comment["_id"]}})
            else: 
                user = usernames_collection.find_one({"username": tweet["username"]})
                tweet["user_id"] = user["_id"]
            # insert the tweet into the tweets array of the user
            # create object ids for the tweets 
            tweet["_id"] = ObjectId()
            usernames_collection.update_one({"_id": user["_id"]}, {"$push": {"tweets": tweet["_id"]}})
            # insert the sentiment of the tweet
            tweet["sentiment"] = get_sentiment(tweet["tweet"])
        tweets_collection.insert_many(tweets_data)
        tweets_data = []

    scraper.close()