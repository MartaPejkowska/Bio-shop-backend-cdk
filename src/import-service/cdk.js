import * as apiGateway from '@aws-cdk/aws-apigatewayv2-alpha'
// import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as cdk from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as iam from 'aws-cdk-lib/aws-iam'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import dotenv from 'dotenv'
import { HttpLambdaAuthorizer, HttpLambdaResponseType } from '@aws-cdk/aws-apigatewayv2-authorizers-alpha';

dotenv.config()

const app= new cdk.App()
const stack= new cdk.Stack(app,'importService',{env:{region:'eu-west-1'}})

const bucket = s3.Bucket.fromBucketName(stack, 'BucketByName', process.env.BUCKET_NAME)

const queue= sqs.Queue.fromQueueArn(stack, 'importQueque', process.env.SQS_ARN)


const sharedLambdaProps={
    runtime: lambda.Runtime.NODEJS_18_X,
    environment:{
        BUCKET_NAME:process.env.BUCKET_NAME,
        SQS_Arn:process.env.SQS_ARN,
        BUCKET_ARN:process.env.BUCKET_ARN,
        SQS_URL:process.env.SQS_URL,
        USER_NAME:process.env.USER_NAME,
        PASSWORD:process.env.PASSWORD,
        LAMBDA_ARN:process.env.LAMBDA_ARN
    }
}

const importFileParser= new NodejsFunction(stack,'importFileParserLambda',{
    ...sharedLambdaProps,
    functionName:'importFileParser',
    entry:'lambdas/importFileParser.js'
})

queue.grantSendMessages(importFileParser)

const importProductsFile= new NodejsFunction(stack, 'importProductFileLambda',{
    ...sharedLambdaProps,
    functionName:'importProductsFile',
    entry:'lambdas/importProductsFile.js'
})

importProductsFile.addToRolePolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [ 's3:*',"lambda:InvokeFunction" ],
    resources: ['*']
  }));
  importFileParser.addToRolePolicy(new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: [ 's3:*',"lambda:InvokeFunction" ],
    resources: [ '*' ]
  }));

  const api= new apiGateway.HttpApi(stack,'importApi',{
    defaultCorsPreflightOptions:{
    allowHeaders: ['*'],
    allowMethods: [apiGateway.CorsHttpMethod.ANY],
    allowOrigins: ['*'],
    }
})

const authFunc=lambda.Function.fromFunctionArn(
    stack,
    'authorization-lambda-from-arn',
    `${process.env.LAMBDA_ARN}`,
  );


const authorizer = new HttpLambdaAuthorizer('ImportAuthorizer', authFunc, {
    responseTypes: [HttpLambdaResponseType.IAM],
  });

api.addRoutes({
    integration: new HttpLambdaIntegration('importFileParserIntegration', importProductsFile,{
        requestParameters:{
            'name':true
        }
    }),
    path:'/import',
    methods:[apiGateway.HttpMethod.GET],
    authorizer,

})


bucket.addEventNotification(
    s3.EventType.OBJECT_CREATED,
    new s3n.LambdaDestination(importFileParser),
    {prefix: 'uploaded/', suffix: '.csv'}
  );
