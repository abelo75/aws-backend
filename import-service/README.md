# Serverless backend implementation

**Cheap charge service for your electric car**

*Charge your car !* )


## Import microservice:
path in mono repository ```/import-service```
### Endpoints:
- import product file: https://bormk75cml.execute-api.eu-west-1.amazonaws.com/dev/import
- [Frontend for check](https://d1w4or432cxowo.cloudfront.net/)

### Task included #5:
1. Created new service
- Created and configured bucket 

2. Created ```serverless.yml``` file for:
- create lambda function ```importProductsFile``` for uploading ```csv``` file to bucket
- add permissions for lambda function
- add permissions for provider
- add resource creating and configure permissions
- add required parameter name check
- add cors
- integrate with endpoint
- function return signed url for file uploading

3. Extended ```serverless.yml``` file: add lambda function ```importFileParser```
- function use event ```s3:ObjectCreated:*```
- function parsed ```csv``` file from bucket folder ```uploaded``` and output to console
- after parsing copy object to folder ```parsed``` and delete object from folder ```uploaded```

Project use:
- ES6 modules
- webpack and babel
- Lambda handler ```importProductsFile``` are covered by UNIT test mocked by ```jest``` framework
- Lambda handlers code written in separate modules
- Lambda handlers use ```async/await```
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
