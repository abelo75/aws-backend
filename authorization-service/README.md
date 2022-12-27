# Serverless backend implementation

**Cheap charge service for your electric car**

*Charge your car !* )


## Authorization microservice:
path in mono repository ```/authorization-service```
### Endpoints:
- import product file: https://bormk75cml.execute-api.eu-west-1.amazonaws.com/dev/import
- [Frontend for check](https://d1w4or432cxowo.cloudfront.net/)

Task included #7:
1. Add authorization lambda ```basicAuthorizer```
2. Lambda use ```401``` status code if no token provided and ```403``` if invalid token provided
3. Lambda use ```.env``` file for token check
4. Frontend correct handle ```200```, ```401``` and ```403``` status codes from localStorage key ```authorization_token``` use ```base64``` encoding


### Deploy

Command for deploy
```npm
npm run deploy
```
### Testing
use command for run unit testing
```npm
npm run test
```
