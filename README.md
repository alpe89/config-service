# Config Service

__Configuration CRUD service powered by Redis__

- [Config Service](#config-service)
- [General Info](#general-info)
    - [Tech Stack](#tech-stack)
    - [Testing](#testing)
    - [Storage](#storage)
- [Developer's Guide](#developers-guide)
- [What should be included next](#what-should-be-included-next)

# General Info

This service is a prototype developed with [**node.js**](https://nodejs.org) in conjunction with [**TypeScript**](https://www.typescriptlang.org/) and as the base web framework we choose [**Expressjs**](https://expressjs.com). Its main purpose is to store a configuration in some kind of storage and offer the ability to execute basic CRUD operations on that kind of data. A configuration is of the type 
```JSON
{
    "id": "some-id",
    "name": "A wonderful Name",
    "value": "Some JSONABLE data"
}
```
The requirements are to stick to this format, so id and name are strings and could only store string values, value could be of any kind of type that can be stored inside a JSON object.

There are **5** public endpoints exposed by the API:
```
[GET]    /      # Retrieve every Configuration Value
[GET]    /:key  # Retrieve Configuration Value for Key=key
[POST]   /:key  # Set the value for Key=key
[PUT]    /:key  # Update configuration for Key=key
[DELETE] /:key  # Delete configuration for Key=key
```
At this point in the development there is absolutely no authentication nor authorization in place, so it's not recommended to use this prototype in a production environment 🏴‍☠️

### Tech Stack

I choose Node because it is my go-to language for the backend, especially for prototypes because in my opinion is very quick and easy to start a project. The same reasons still holds for Express as the framework of choice, very easy to use and not opinionated on the project structure nor the packages that uses. As for the testing framework I'm using Jest because is the default test runner of the React ecosystem and could be beneficial to have the same platform to test Backend and Frontend code in order to share knowledge through the teams. 

### Testing

There are a couple of test suites with unit tests and integration test (API). It is not enough by any means and with time we should add test cases in order to cover the broad majority of the functionalities and edge cases of the application
### Storage

The choice of which type of storage has been quite simple, a fast and robust in-memory datastore, so Redis is the "database" that is going to store the configurations. The initial prototype used to store everything in a plain Javascript Object (basically a map), then we have added Redis support without changing the core Express application. As of today you can easily switch the type of Storage with a simple change in the environment file ```.env```, inside the project there is a "Factory" that builds the instance of the Storage type desired.

# Developer's Guide

To contribute to the project you should fork the project and clone it. As soon as you have your local repository on your development machine you're ready to start. As the first thing to do is to install the dependencies, so after you've got inside the repository's folder just
```bash
npm install
```
Wait until every dependency is installed and then you can run a bunch of commands through npm
```bash
npm start 
# Starts the application in production mode, you must have some kind of Redis server (🐳?) ready to accept connections or it will crash
npm run dev
# Starts the application in development mode through nodemon, so you can develop and any time you change a typescript file your server is restarted. As the default Storage you'll use the Memory type, you can easily swap with Redis (and as for the previous command you must have some kind of Redis server ready) just updating the .env file's DB_TYPE variable.
npm test
# Runs the test suites of the project
npm run make
# Compiles the TypeScript code in the ./build directory, this command is automatically run before npm start
npm start:docker
# Starts two docker containers through docker-compose, the first container that starts is the Redis server, then the application's one. This is the command to "test" the "production" version of the project
npm stop:docker
# Stops the two container spinned with the previous command
```

The code on you should work on is inside the ```src``` directory and the tests are in the ```test``` directory, everything else is just for configuration or to build the Docker image for the app.

# What should be included next

As I stated before, this is just a prototype for this service, and while developing it I had many ideas for the future development of it.

- Add persistency to the storage, as of now in "production" if the Redis server crashes everything is wiped
- Add a "fall-back" from Redis to the in-memory type of storage when we detect a connection error with Redis. This means to save in a compressed format on the disk (or in some cloud storage) the data stored in Redis. Then as soon as Redis is back online we should update the data and switch again the storage type for the application.
- Based on the last point, we could insert more Storage Engines, maybe something like MongoDB or a No-SQL database to fallback when Redis goes offline. The in-memory solution should be used only in local development and testing, or as the very last choice.
- Write way more unit and integration tests
- Add a common interface to send back errors from the requests