from twitter_scraper import Twitter_scraper
import json
import sys

if __name__ == "__main__":

    # total arguments
    if (len(sys.argv) < 2):
        print("No arguments passed")
        print("Usage: python get_tweets.py <username> <password>")
        exit(0)

    n = len(sys.argv)
    scraper = Twitter_scraper(sys.argv[1], sys.argv[2])
    num_tweets = 1

    tweets_data = scraper.search('covid', num_tweets)

    # save the tweets_data.json file
    with open("database/tweets_data.json", "w") as f:
        json.dump(tweets_data, f, indent=4)

    scraper.close()

    