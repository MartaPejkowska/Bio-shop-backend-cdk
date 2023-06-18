import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand} from "@aws-sdk/client-s3";

const bucket=process.env.BUCKET_NAME


export const handler= async (event)=>{

const fileName=event.queryStringParameters.name
console.log(fileName)

// if(!fileName){
//     return responses._400('Invalid data')
// }

const params={
    Bucket:bucket,
    Key:`uploaded/${fileName}`,
    ContentType: 'text/csv',
}

const command = new PutObjectCommand(params);
const client=new S3Client({ region: 'eu-west-1' })
const url = await getSignedUrl(client, command, { expiresIn: 3600 });

console.log('url',url)

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
