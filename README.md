# Summarise
This Chrome extension built with React, NestJS, and TypeScript, integrates the OpenAI API to help users generate brief summaries of articles or webpages by highlighting text.

# Set up
From your command line, clone and run summarise:
```shell
# Clone this repository
$ git clone https://github.com/AnHersi/summarise.git

# Go into the repository
$ cd summarise/

# Install dependencies
$ cd frontend/
$ npm install

$ cd backend/
$ npm install

#Start backend and frontend
$ cd frontend/
$ npm run start

$ cd backend/
$ npm run start:dev
```
# OpenAI and mongoDB
In the root directory of backend create a .env file and add your api key and connection string.
```shell
MONGO_URI="YOUR_CONNECTION_STRING" 
OPENAI_API_KEY="YOUR_API_KEY"
```
# Chrome extension
Go to the Chrome extension settings, toggle developer mode, click 'load unpacked', and select the '/frontend/dist' folder in the project.

<img width="413" alt="Screenshot 2023-04-21 at 00 48 19" src="https://user-images.githubusercontent.com/24738379/233511579-c9b262bd-75b0-4bc7-91d1-652d65421527.png">
