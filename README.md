# Strava_nodejs
 Simple Strava API + Javascript + Node.js + Docker solution
 
The code is based on [the Javascript only version](https://github.com/fpolignano/Code_From_Tutorials/tree/master/Strava_Api/LeafletUpdates) version by [Fran Polignano](https://github.com/fpolignano).
 His [YouTube tutorials](https://www.youtube.com/watch?v=sgscChKfGyg&list=PLO6KswO64zVvcRyk0G0MAzh5oKMLb6rTW) and code on Github were very helpful for me to get started with the Strava API.
 
His code had a few problems though, so I tried to fix them. One major problem for me was the fact that the Strava credentials were visible in the JavaScript code, meaning anyone could gain access to your account that way. The only way that I found to fix that was by splitting the application up into two parts: a server part (build using Node.js) and a client-part (using Javascript). Using Node.js had the added benifit that I could re-use much of the code. It also allowed for 'local' (on the server) caching, which is needed due to the limits that Strava has put on the number of API call that you can make during a given timeperiod.
 
Because I did not want to install Node.js on my local system, I used Docker as a way to easily deploy it for the development setting and (based on the same code, just with a different way of building the Docker container) for production purposes.
Documentation is still lacking, but the code is here.
 
 ## .env
 All configuration is done via the .env file. Make sure you replace 
 ```javascript
client_id=1234567
client_secret=xxxxxxxxx
refresh_token=xxxxxxx
```
with the appropriate values.

You can also set the amount of minutes that the data is being cached through the 'expire' value. It is set to 60 (1 hour) by default, but even bigger values are usually good.
In .env you can set the activities you want to ignore (add the Strava activity ID) and the types of activities (can be multiple) that you want to display.
Changes to .env will only be read by node.js when the server restarts.

You can set the 'activity_since' variable to indicate how far back the script needs to go. Paging has been implemented, so it is possible to go back more than the current 60 per page activities (Strava limits the number per page to 200).

## Clear cache
If you want to force the clearing of the cache, go to /cache/refresh/6tuyfh456

The '6tuyfh456' part of the url is set in .env and can (should) be changed to something you only know.

## Docker
To use the development setup, you need to install Docker and then run the run-docker.sh file.
After that you'll be logged into the container and need to do some more things to install everything the first time:
```
yarn init -y
yarn add express
yarn add -D nodemon
yarn add flat-cache --ignore-engines
yarn add dotenv --ignore-engines
yarn add node-fetch --ignore-engines
```
with
```
yarn start
```
you can then start the server and reach it on port 8080 (not 3000!)
This server stops working if you close the command window.

The run-node-strava.sh is meant to be used with a production version. First you have to build the image using
```
sudo docker build -t docker-strava .
```
Then you can use run-node-strava.sh to start a server in the background. It will run on port 8081 by default.
