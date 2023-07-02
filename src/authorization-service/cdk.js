import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import dotenv from 'dotenv'

dotenv.config()

const app= new cdk.App()

const stack= new cdk.Stack(app, 'authorizationService', {env:{region:'eu-west-1'}})

const sharedLambdaProps={
    runtime: lambda.Runtime.NODEJS_18_X,
    environment:{
        MartaPejkowska:process.env.MartaPejkowska
    }
}

const basicAuthorizer= new NodejsFunction(stack,'basicAuthorizerLambda',{
    ...sharedLambdaProps,
    functionName:'basicAuthorizer',
    entry:'lambdas/basicAuthorizer.js'
})


