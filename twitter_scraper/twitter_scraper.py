from scraper import Scraper
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from tqdm import tqdm
import re, time, datetime   

class Twitter_scraper(Scraper):

    def __append_tweets_data(self, tweets_data, driver):

        try:
            twitter_elm = driver.find_elements(By.CSS_SELECTOR, '[data-testid="tweet"]')
        except:
            return
        
        i = 0

        for post in twitter_elm:

            atags = post.find_elements(By.TAG_NAME, 'a')
            # take the href with status inside
            url = ""
            for atag in atags:
                if "status" in atag.get_attribute("href"):
                    url = atag.get_attribute("href")
                    break

            try:
            
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

                new_record = {"username": username, "name": name, "tweet": text, "replies": super()._convert_to_int(reply_div.text), "retweets": super()._convert_to_int(retweet_div.text), "likes": super()._convert_to_int(like_div.text), "shares": super()._convert_to_int(share_div.text), "url": url}

                if new_record not in tweets_data:
                    tweets_data.append(new_record)
                    i += 1

            except:
                pass

    def get_tweets(self, num_scrolls, scroll_iterations, driver_wait_time, scroll_wait_time):

        tweets_data = []

        try:
            elem = self.driver.find_element(By.TAG_NAME, "body")
        except:
            return tweets_data

        self.__append_tweets_data(tweets_data, self.driver)

        # use tqdm to show the progress bar
        for _ in tqdm(range(num_scrolls)):

            for _ in range(scroll_iterations):
                try:
                    elem = self.driver.find_element(By.TAG_NAME, "body")
                except:
                    return tweets_data
                elem.send_keys(Keys.PAGE_DOWN)
                time.sleep(scroll_wait_time)

            # Wait for new tweets to load
            wait = WebDriverWait(self.driver, driver_wait_time)
            wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, '[data-testid="appLoader"]')))

            self.__append_tweets_data(tweets_data, self.driver)

        return tweets_data
    
    def get_trends(self):
        
        trends_data = []

        body = self.driver.find_element(By.TAG_NAME, "body")

        try:
            list = body.find_elements(By.CSS_SELECTOR, '[data-testid="trend"]')
        except:
            return trends_data

        for elem in list:
            # take the first div into the list
            div = elem.find_elements(By.TAG_NAME, 'div')[0]
            # take the text into the second div
            text = div.find_elements(By.TAG_NAME, 'div')[4].text
            # take the number of posts into the third div
            number_of_posts = super()._convert_to_int(div.find_elements(By.TAG_NAME, 'div')[5].text.split(' ')[0])
            # take the url of the post, search the a tag and take the href attribute containinh the 'hashtag' string
            trend_name = text.replace('#', '%23')
            url = "https://twitter.com/search?q={}&src=trend_click&vertical=trends".format(trend_name)
            
            print(text, number_of_posts)

            if number_of_posts > 0:
                trends_data.append({"trending_topic": text, "number_of_posts": number_of_posts, "date":  datetime.datetime.now(tz=datetime.timezone.utc), "url": url})
            else:
                trends_data.append({"trending_topic": text, "date": datetime.datetime.now(tz=datetime.timezone.utc), "url": url})

        return trends_data
    
    def get_user(self):
        
        user_data = {}

        try:
            username_div = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="UserName"]')
        except:
            return
        
        spans = username_div.find_elements(By.TAG_NAME, 'span')
        user_data["profile_name"] = spans[1].text
        user_data["username"] = spans[-1].text

        try:
            username_div.find_element(By.TAG_NAME, 'svg')
            user_data["verified"] = True
        except:
            user_data["verified"] = False

        try:
            bio_div = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="UserDescription"]')
            text_span = bio_div.find_elements(By.TAG_NAME, 'span')
            text = ""
            # concatenate all the text into the spans
            for span in text_span:
                text += ' ' + span.text
            user_data["bio"] = re.sub(r'\s+', ' ', text.replace('\n', ' '))
        except:
            pass

        try:
            items_div = self.driver.find_element(By.CSS_SELECTOR, '[data-testid="UserProfileHeader_Items"]')
            try:
                user_data["location"] = items_div.find_element(By.CSS_SELECTOR, '[data-testid="UserLocation"]').text
            except:
                pass
            try:
                user_data["url"] = items_div.find_element(By.CSS_SELECTOR, '[data-testid="UserUrl"]').text
            except:
                pass
            try:
                user_data["birth_date"] = items_div.find_element(By.CSS_SELECTOR, '[data-testid="UserBirthdate"]').text
            except:
                pass
            try:
                user_data["joined_date"] = items_div.find_element(By.CSS_SELECTOR, '[data-testid="UserJoinDate"]').text
            except:
                pass 
            try:
                sibling_elements = username_div.find_elements(By.XPATH, "./following-sibling::*")
                sibling_elements = sibling_elements[-2]
                # take the two divs inside
                divs = sibling_elements.find_elements(By.TAG_NAME, 'div')
                # for the first and the second div take the text into the second span
                user_data["following"] = super()._convert_to_int(divs[0].find_elements(By.TAG_NAME, 'span')[1].text)
                user_data["followers"] = super()._convert_to_int(divs[1].find_elements(By.TAG_NAME, 'span')[1].text)
            except:
                pass
        except:
            pass
            
        return user_data
    
    def get_comments(self, tweets, scroll_wait_time, driver_wait_time):
        
        # for each tweet in the list of dicts, take the url and the number of replies
        for tweet in tweets:

            url = tweet["url"]
            replies = tweet["replies"]

            # if the number of replies is greater than 0, then get the comments
            if replies > 0:
                # open the url of the tweet
                self.driver.get(url)

                # wait for the page to load
                time.sleep(driver_wait_time)

                # take the comments which are tweets in turn so we can reuse the __append_tweets_data function
                comments = []

                # make a scroll down for each reply
                for _ in tqdm(range(min(replies,50))):
                    # scroll down
                    self.driver.find_element(By.TAG_NAME, "body").send_keys(Keys.PAGE_DOWN)
                    time.sleep(scroll_wait_time)
                    # append the comments to the list of comments
                    self.__append_tweets_data(comments, self.driver)
                    # if there's a span containing the text "Show more replies", then click it
                    try:
                        showMoreReplies = self.driver.find_elements(By.LINK_TEXT, "Show more replies")
                        showMoreReplies[-1].click()
                    except:
                        pass

                # add the comments to the tweet
                # remove the first comment which is the tweet itself
                if (len(comments[1:])) > 0:
                    tweet["comments"] = comments[1:]
