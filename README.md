# Twitter sentiment analysis database

This project is made up of two main parts:

1. a **database** module,
2. a **X scraper** module.

## Database

For the details about the database design read the [doc_Twitter_DB.pdf](https://docs.google.com/document/d/1nrY6ossFJN2PwIf05ZRFzYorwiSaiXuRNu15mVba_BA/edit?usp=sharing) file.

To use the database follow these steps:

* execute `load("database/CRUD/createSchema.js")` in `mongosh`, this file creates the database, the collections, the validators for the collections and the indexes,
* execute `pip install pymongo`
* execute `python database/CRUD/loadData.py` to load the data from the database/data/* folders into the just created collections of the database,
* then you're able to execute the CRUD operations stored in the .js file in the database/CRUD folder in mongosh using the `load("database/CRUD/operationName.js")` command and the same goes for the queries in the database/queries and database/complex_queries folders.

## X scraper

This module has been set up to obtain real time data from X in a almost automatic way. To start collecting data, you can simply execute `python twitter_scraper/main.py <username> <password>`. This script, uses the scraper to collect the current 10 main trends, a certain quantity of the related tweets with their respective comments and the public information about the users who wrote the tweets. The collected data are saved into the data/trends, data/tweets and data/users folders respectively.
