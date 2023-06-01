import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import dotenv from 'dotenv'

dotenv.config()

const app= new cdk.App()

const stack= new cdk.Stack(app, 'productService', {env:{region:'eu-west-1'}})

const sharedLambdaProps={
    runtime: lambda.Runtime.NODEJS_18_X,
    environment:{
        PRODUCT_AWS_REGION:process.env.PRODUCT_AWS_REGION
    }
}

const getProductsList= new NodejsFunction(stack,'getProductsListLambda',{
    ...sharedLambdaProps,
    functionName:'getProductsList',
    entry:'lambdas/getProductsList.js'
})

const getProductsById= new NodejsFunction(stack,'getProductsByIdLambda',{
    ...sharedLambdaProps,
    functionName:'getProductsById',
    entry:'lambdas/getProductsById.js'
})

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