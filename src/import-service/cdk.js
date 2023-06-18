import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as iam from 'aws-cdk-lib/aws-iam'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications'
import * as s3 from 'aws-cdk-lib/aws-s3'
import dotenv from 'dotenv'


dotenv.config()

const app= new cdk.App()
const stack= new cdk.Stack(app,'importService',{env:{region:'eu-west-1'}})

const BUCKET_NAME=process.env.BUCKET_NAME
const BUCKET_ARN=process.env.BUCKET_ARN


// const bucket = new s3.Bucket(stack, BUCKET_NAME);
const bucket = s3.Bucket.fromBucketName(stack, 'BucketByName', BUCKET_NAME)

const sharedLambdaProps={
    runtime: lambda.Runtime.NODEJS_18_X,
    environment:{
        BUCKET_NAME:BUCKET_NAME,
        SQS_Arn:process.env.SQS_ARN,
        BUCKET_ARN:BUCKET_ARN
    }
}

const importFileParser= new NodejsFunction(stack,'importFileParserLambda',{
    ...sharedLambdaProps,
    functionName:'importFileParser',
    entry:'lambdas/importFileParser.js'
})

const importProductsFile= new NodejsFunction(stack, 'importProductFileLambda',{
    ...sharedLambdaProps,
    functionName:'importProductsFile',
    entry:'lambdas/importProductsFile.js'
})

importProductsFile.addToRolePolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [ 's3:*' ],
    resources: ['*']
  }));
  importFileParser.addToRolePolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [ 's3:*' ],
    resources: [ '*' ]
  }));

const api= new apiGateway.HttpApi(stack,'importApi',{
    defaultCorsPreflightOptions:{
    allowHeaders: ['*'],
    allowMethods: [apiGateway.CorsHttpMethod.ANY],
    allowOrigins: ['*'],
    }
})

api.addRoutes({
    integration: new HttpLambdaIntegration('importFileParserIntegration', importProductsFile,{
        requestParameters:{
            'name':true
        }
    }),
    path:'/import',
    methods:[apiGateway.HttpMethod.GET],

})

bucket.addEventNotification(
    s3.EventType.OBJECT_CREATED,
    new s3n.LambdaDestination(importFileParser),
    {prefix: 'uploaded/', suffix: '.csv'}
  );
