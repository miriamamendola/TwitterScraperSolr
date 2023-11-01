/*
    7. DISCUSSIONS' DETECTION   
    Given a trend, for each tweet associated with it, check if its comments have given rise to a discussion by 
    identifying any discordant sentiments
*/

db = connect("localhost:27017")

db = db.getSiblingDB('Twitter')

trendName = "#matthewperry"
trendLocation = "Italy"
trendDate = "2023-10-29T18:02:35.555779"

result = db.getCollection("Trends").aggregate([
    {
      '$match': {
        'name': trendName, 
        'location': trendLocation, 
        'date': trendDate
      }
    }, {
      '$unwind': {
        'path': '$tweets'
      }
    }, {
      '$lookup': {
        'from': 'Tweets', 
        'localField': 'tweets', 
        'foreignField': '_id', 
        'as': 'tweetsData'
      }
    }, {
      '$unwind': {
        'path': '$tweetsData'
      }
    }, {
      '$unwind': {
        'path': '$tweetsData.comments'
      }
    }, {
      '$group': {
        '_id': '$tweetsData._id', 
        'text': {
          '$first': '$tweetsData.text'
        }, 
        'comments': {
          '$push': '$tweetsData.comments'
        }
      }
    }, {
      '$project': {
        '_id': 0, 
        'text': 1, 
        'comments': 1, 
        'hasDiscordantSentiment': {
          '$reduce': {
            'input': '$comments', 
            'initialValue': false, 
            'in': {
              '$cond': {
                'if': {
                  '$ne': [
                    '$$this.sentiment', '$$value.sentiment'
                  ]
                }, 
                'then': true, 
                'else': '$$value'
              }
            }
          }
        }
      }
    }
  ])

printjson(result.toArray())