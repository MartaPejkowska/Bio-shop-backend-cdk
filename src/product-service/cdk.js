import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as iam from 'aws-cdk-lib/aws-iam'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import dotenv from 'dotenv'

dotenv.config()

const app= new cdk.App()

const stack= new cdk.Stack(app, 'productService', {env:{region:'eu-west-1'}})

const sharedLambdaProps={
    runtime: lambda.Runtime.NODEJS_18_X,
    environment:{
        PRODUCT_AWS_REGION:process.env.PRODUCT_AWS_REGION,
        TABLENAME:process.env.TABLENAME,
        STOCKTABLENAME:process.env.STOCKTABLENAME
    }
}

const getProductsList= new NodejsFunction(stack,'getProductsListLambda',{
    ...sharedLambdaProps,
    functionName:'getProductsList',
    entry:'lambdas/getProductsList.js'
})


getProductsList.addToRolePolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [ 'dynamodb:*' ],
    resources: [ '*' ]
  }));


const getProductsById= new NodejsFunction(stack,'getProductsByIdLambda',{
    ...sharedLambdaProps,
    functionName:'getProductsById',
    entry:'lambdas/getProductsById.js',
})

getProductsById.addToRolePolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [ 'dynamodb:*' ],
    resources: [ '*' ]
  }));

const createProduct= new NodejsFunction(stack,'createProductLambda',{
    ...sharedLambdaProps,
    functionName:'createProduct',
    entry:'lambdas/createProduct.js',
})

createProduct.addToRolePolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [ 'dynamodb:*' ],
    resources: [ '*' ]
  }));

const insertManyProducts= new NodejsFunction(stack,'insertManyProductsLambda',{
    ...sharedLambdaProps,
    functionName:'insertManyProducts',
    entry:'lambdas/insertManyProducts.js',
})

insertManyProducts.addToRolePolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [ 'dynamodb:*' ],
    resources: [ '*' ]
  }));

// const productsTable= new dynamodb.Table(stack, 'productsTable',{
//     partitionKey:{name: 'id', type: dynamodb.AttributeType.STRING}
// })

// const stockTable= new dynamodb.Table(stack, 'stockTable', {
//     partitionKey:{ name: 'product_id', type: dynamodb.AttributeType.STRING}
// })


const api= new apiGateway.HttpApi(stack,'productApi',{
    corsPreflight:{
    allowHeaders: ['*'],
    allowMethods: [apiGateway.CorsHttpMethod.ANY],
    allowOrigins: ['*'],
    }
})

api.addRoutes({
    integration: new HttpLambdaIntegration('GetProductsListIntegration', getProductsList),
    path:'/products',
    methods:[apiGateway.HttpMethod.GET]
})

api.addRoutes({
    integration: new HttpLambdaIntegration('GetProductsByIdIntegration', getProductsById),
    path:'/products/{productId}',
    methods:[apiGateway.HttpMethod.GET]
})

api.addRoutes({
    integration: new HttpLambdaIntegration('createProductIntegration', createProduct),
    path:'/products',
    methods:[apiGateway.HttpMethod.POST]
})

api.addRoutes({
    integration: new HttpLambdaIntegration('insertManyProductsIntegrationDb', insertManyProducts),
    path:'/addproducts',
    methods:[apiGateway.HttpMethod.POST]
})
