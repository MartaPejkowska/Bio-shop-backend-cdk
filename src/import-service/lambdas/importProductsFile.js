import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand} from "@aws-sdk/client-s3";

const bucket=process.env.BUCKET_NAME

export const handler= async (event)=>{

  try{

    const fileName=event.queryStringParameters.name

    if(typeof event.queryStringParameters==undefined || !fileName){
        return {statusCode: 400,
          body: 'Invalid data, No file'}
    }

    const params={
        Bucket:bucket,
        Key:`uploaded/${fileName}`,
        ContentType: 'text/csv',
    }

    const command = new PutObjectCommand(params);
    const client=new S3Client({ region: 'eu-west-1' })
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });

    const response = {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Content-Type':'text/csv'
        },
        statusCode: 200,
        body: JSON.stringify({
          url
        }),
      };
      console.log(response)
    return response
  }
  catch{
    err=> console.log(err)
    return {statusCode: 500,
    body: 'Error'}
  }

}
