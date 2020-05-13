## Twittie Backend

 - Scrapes country/state wise trends data from twitter and save to
   database.
 - Manages endpoints to serve data.
 - Manages twitter user oauth.

*Instructions:*
> Clone repo then,

 1. npm install - Install dependency
 2. npm start - run dev server
 3. npm run nodemon - run dev server with nodemon
 4. create .env at project root with following entries-

> PORT = 5656  
> DB_STRING = mongodb://-------------------------------------------------/trendytags
> TWITTER_CONSUMER_KEY = yva----------------------------pgUkz
> TWITTER_CONSUMER_SECRET = NsHSq5----------------------------tWXBhGN
> TWITTER_ACCESS_TOKEN = 10760008593334394----------------------------tOfSxOcutZ
> TWITTER_ACCESS_TOKEN_SECRET = dc982J----------------------------q3s7mMUIdEJ
> TWITTER_CALLBACK = https://RUNNING_SERVER_ADDRESS/user/granted
> FRONTEND = https://twittie.herokuapp.com/
