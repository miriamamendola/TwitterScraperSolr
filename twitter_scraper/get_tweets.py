from twitter_scraper import Twitter_scraper
import json

if __name__ == "__main__":

    scraper = Twitter_scraper()

    login_time = 60
    scraper.get_page("https://twitter.com", login_time)

    num_scrolls = 10
    scroll_iterations = 50
    driver_wait_time = 10
    scroll_wait_time = 1

    tweets_data = scraper.get_tweets(num_scrolls, scroll_iterations, driver_wait_time, scroll_wait_time)

    # save the tweets_data.json file
    with open("database/tweets_data.json", "w") as f:
        json.dump(tweets_data, f, indent=4)

    scraper.close()
