# Serverless backend implementation

**Cheap charge service for your electric car**

*Charge your car !* )


## Import microservice:
path in mono repository ```/import-service```
### Endpoints:
- import product file: https://bormk75cml.execute-api.eu-west-1.amazonaws.com/dev/import
- [Frontend for check](https://d1w4or432cxowo.cloudfront.net/)

Task included #7:
1. Add authorization for ```/import``` endpoint
2. Add CORS support for 4XX statuses

   Project included:
- async/await in lambda functions
- ES6 modules
- webpack and babel
- Lambda handlers are covered by basic UNIT test
- Lambda handlers code written in separate modules
- API gateway [OpenAPI swagger documentation](swagger.yaml)

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
