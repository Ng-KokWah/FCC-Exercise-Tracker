# FCC-Exercise-Tracker
This project was coded as part of the FreeCodeCamp Apis and Microservices Projects - Exercise Tracker. You can also try it out here: https://gregarious-unicorn.glitch.me/

## To use this:
1. Ensure you have node.js installed. If not install from https://nodejs.org/en/
2. Clone/download this repo
3. (Skip this if you used git clone) Unzip the downloaded file. 
4. Open command prompt (for windows, win + r -> cmd -> enter)
5. Change directory into the FCC-Timestamp-Microservice folder
6. This project needs express,cors, mongodb, mongoose, body-parser & shortid, do install using npm if you do not have it
7. Refer to the server.js on where to append the connection string of your database (You can create and account and the database in https://mlab.com/), afterwhich get the connection string for this database and paste it into my placeholder, const uri = <INSERT-CONNECTION-STRING-HERE>; 
8. Run the command Node server.js, you should get a reply of "Your app is listening on port 50023" (50023 is the port i specified to listen on)
9. Now go your localhost with the assigned port, 127.0.0.1:50023 and refer to that for usages

# If you want to try doing this project:
You can either visit http://freecodecamp.com
OR
Clone the base Repo from FCC: https://github.com/freeCodeCamp/boilerplate-project-exercisetracker/
and Ensure that you meet all the User Stories below:

# User Stories :
1. I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
2. I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
3. I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. Returned will the the user object with also with the exercise fields added.
4. I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).
5. I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)
