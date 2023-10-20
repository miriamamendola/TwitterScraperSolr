from twitter_scraper import Twitter_scraper
import json

if __name__ == "__main__":

    scraper = Twitter_scraper()

    login_time = 60
    scraper.get_page("https://twitter.com", login_time)

    trends_data = scraper.get_trends()

    # prettify and save the json file
    with open("database/trends_data.json", "w+") as f:
        json.dump(trends_data, f, indent=4)

    scraper.close()