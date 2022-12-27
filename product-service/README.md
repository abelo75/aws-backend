# Serverless backend implementation

**Cheap charge service for your electric car**

*Charge your car !* )


## Product microservice:
path in mono repository ```/product-service```
### Endpoints:
- products list: https://16zpz4tfm7.execute-api.eu-west-1.amazonaws.com/products
- product by id: https://16zpz4tfm7.execute-api.eu-west-1.amazonaws.com/products/{productId}
- put products stock count PUT: https://16zpz4tfm7.execute-api.eu-west-1.amazonaws.com/products/{productId}
- create nwe product POST: https://16zpz4tfm7.execute-api.eu-west-1.amazonaws.com/products
- [Frontend for check](https://d1w4or432cxowo.cloudfront.net/)

Task included #7:

no changes in microservice for task #7
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
