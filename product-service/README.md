# Serverless backend implementation

**Cheap charge service for your electric car**

*Charge your car !* )


## Product microservice:
path in mono repository ```/product-service```
### Endpoints:
- products list: https://5h99mxgyil.execute-api.eu-west-1.amazonaws.com/products
- product by id: https://5h99mxgyil.execute-api.eu-west-1.amazonaws.com/products/{productId}



[mock data file](data/mock.js)

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

Project included:
- async/await in lambda functions
- ES6 modules
- webpack and babel
- Lambda handlers are covered by basic UNIT test
- Lambda handlers code written in separate modules
- use status codes 404 for product not found and 500 for internal server error
- API gateway [OpenAPI swagger documentation](swagger.yaml)

Links:
[Frontend for check](https://d1w4or432cxowo.cloudfront.net/)
