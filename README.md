# README

Hard Dependency
1. Node JS
2. NPM
_____________________________________________________________________________________
Brief Description: This is a little overengineered implementation that solves the question. 
I sit and think about how I should get this done:

1. Full View - Controller - Model
2. Question regarding dependency of tools
2.1 Database - Postgres? SQL Server? Should I produce a script that facilitate installation of these dependency
3. Hence why I chose SqlLite as my choice of DB, simple without needing to wire extra dependency
4. Hence why I design Model - Controller and just use Postman to test the validity of the output
5. I have entertained the thought of further capitalising on Postman Post-Script for better output validation 
5.1 Should I make use of Post-Script to expect and assert
5.2 Should I wire the entire postman endpoint into a single automated testing
6. But I resort on keeping Point (5) as possible way of improvement for the sake of simplicity of the prototype

GET /feature?email=XXX&featureName=XXX

This endpoint receives email (user’s email) and featureName as request parameters and
returns the following response in JSON format.

Example Response:

{

"canAccess": true|false (will be true if the user has access to the featureName)

}

POST /feature

This endpoint receives the following request in JSON format and returns an empty
response with HTTP Status OK (200) when the database is updated successfully, otherwise
returns Http Status Not Modified (304).

Example Request:

{

"featureName": "xxx", (string)

"email": "xxx", (string) (user's name)

"enable": true|false (boolean) (uses true to enable a user's access, otherwise

}

_____________________________________________________________________________________

Instruction
1. NPM Install - Trigger installation of dependency as specified in package.json
2. node main.js - Start the server with ports specified in main.js, consider change the port if 8080 is used by other service
3. Export postman.json into postman collection - Postman is being used to test validity of endpoint to meet expectation of the question
4. There will be 3 Endpoint Folder in Postman Collection (Feature, User and User Feature)
5. Run create table for each endpoint
6. Run create data for each endpoint (Feature, followed by user and lastly user feature)
7. Run isUserRoleEnable (Q1) for answer of Q1
8. Run Switch IsEnable of User Role (Q2) for answer of Q2
9. The rest of endpoint is just optional


Ways to improve
1. Adding interceptor so that error handling code could be reused
2. Typescript conversion and application of Generics
