from scraper import Scraper
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from tqdm import tqdm
import re, time, datetime   

class Twitter_scraper(Scraper):

    def __append_tweets_data(self, tweets_data, driver):

        twitter_elm = driver.find_elements(By.CSS_SELECTOR, '[data-testid="tweet"]')
        print('+',len(twitter_elm),' new tweets!\n')

        for post in twitter_elm:
            
            username_div = post.find_element(By.CSS_SELECTOR, '[data-testid="User-Name"]')

            username = username_div.find_elements(By.TAG_NAME, 'a')
            name = username[0].text
            username = username[1].text

            tweet_div = post.find_element(By.CSS_SELECTOR, '[data-testid="tweetText"]')
            # remove all the spaces (except 1) and newlines from the tweet
            text = re.sub(r'\s+', ' ', tweet_div.text.replace('\n', ' '))
            
            reply_div = post.find_element(By.CSS_SELECTOR, '[data-testid="reply"]')
            retweet_div = post.find_element(By.CSS_SELECTOR, '[data-testid="retweet"]')
            like_div = post.find_element(By.CSS_SELECTOR, '[data-testid="like"]')
            share_div = post.find_element(By.CSS_SELECTOR, '[data-testid="app-text-transition-container"]')

            tweets_data.append({"username": username, "name": name, "tweet": text, "replies": super()._convert_to_int(reply_div.text), "retweets": super()._convert_to_int(retweet_div.text), "likes": super()._convert_to_int(like_div.text), "shares": super()._convert_to_int(share_div.text)})

    def get_tweets(self, num_scrolls, scroll_iterations, driver_wait_time, scroll_wait_time):

        tweets_data = []
        elem = self.driver.find_element(By.TAG_NAME, "body")

        self.__append_tweets_data(tweets_data, self.driver)

        # use tqdm to show the progress bar
        for _ in tqdm(range(num_scrolls)):

            print("Scrolling down...")
            for _ in range(scroll_iterations):
                elem = self.driver.find_element(By.TAG_NAME, "body")
                elem.send_keys(Keys.PAGE_DOWN)
                time.sleep(scroll_wait_time)

            # Wait for new tweets to load
            wait = WebDriverWait(self.driver, driver_wait_time)
            wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, '[data-testid="appLoader"]')))

            print("Adding new tweets...")
            self.__append_tweets_data(tweets_data, self.driver)

        return tweets_data
    
    def get_trends(self):
        
        trends_data = []

        body = self.driver.find_element(By.TAG_NAME, "body")
        list = body.find_elements(By.CSS_SELECTOR, '[data-testid="trend"]')

        for elem in list:
            # take the first div into the list
            div = elem.find_elements(By.TAG_NAME, 'div')[0]
            # take the text into the second div
            text = div.find_elements(By.TAG_NAME, 'div')[4].text
            # take the number of posts into the third div
            number_of_posts = super()._convert_to_int(div.find_elements(By.TAG_NAME, 'div')[5].text.split(' ')[0])
            # take the current data and save it as a datetime object in a json file
            current_date = datetime.datetime.now()

            print(text, number_of_posts)

            if number_of_posts > 0:
                trends_data.append({"trending_topic": text, "number_of_posts": number_of_posts, "date": current_date.strftime("%d/%m/%Y %H:%M:%S")})
            else:
                trends_data.append({"trending_topic": text, "date": current_date.strftime("%d/%m/%Y %H:%M:%S")})

        return trends_data
    