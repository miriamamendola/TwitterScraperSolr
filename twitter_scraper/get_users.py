from twitter_scraper import Twitter_scraper
import json

if __name__ == "__main__":

    scraper = Twitter_scraper()

    login_time = 60
    scraper.get_page("https://twitter.com", login_time)

    user_data = scraper.get_user()

    # prettify and save the json file
    with open("database/user_data.json", "w") as f:
        json.dump(user_data, f, indent=4)

    scraper.close()


