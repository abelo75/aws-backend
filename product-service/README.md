# Serverless backend implementation

**Cheap charge service for your electric car**

*Charge your car !* )


## Product microservice:
path in mono repository ```/product-service```
### Endpoints:
- products list: https://5h99mxgyil.execute-api.eu-west-1.amazonaws.com/products
- product by id: https://5h99mxgyil.execute-api.eu-west-1.amazonaws.com/products/{productId}
- put products stock count PUT: https://5h99mxgyil.execute-api.eu-west-1.amazonaws.com/products/{productId}
- create nwe product POST: https://5h99mxgyil.execute-api.eu-west-1.amazonaws.com/products
- [Frontend for check](https://d1w4or432cxowo.cloudfront.net/)

Task included #4:
1. Create in AWS console
- Create products table DynamoDB
- Create stocks table DynamoDB

2. Extending ```serverless.yml``` file
- include databases
- integrate all lambda functions with database
- add lambda function for create product **createProduct**, URL: /products, method: POST
- add lambda function for update product stock count **updateStock**, URL: /products, method: PUT
- all endpoints return status code 400 on wrong parameters
- for update stock count and list products by id return status code 404 on wrong product id
- all endpoints return status code 500 on server error (databases,  etc...)
- frontend works

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
