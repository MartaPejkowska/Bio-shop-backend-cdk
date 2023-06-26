import csv from 'csv-parser'
import * as dotenv from 'dotenv'
dotenv.config()
import { S3Client, GetObjectCommand, CopyObjectCommand,DeleteObjectCommand} from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
const results = [];

export const handler= async (event)=>{

    const s3= new S3Client();
    const sqs = new SQSClient({ region: "eu-west-1" });

    const queueUrl=process.env.SQS_URL
    const bucket=event.Records[0].s3.bucket.name
    const key=event.Records[0].s3.object.key

    const input={
        Bucket:bucket,
        Key:key
        }
        //Getting Object
    const command = new GetObjectCommand(input);
    const response =  await s3.send(command)


      const csvFunction= response.Body.pipe(csv()).on("data", async(data) => {

            results.push(data);
            }).on("end", async() => {
                  return results
                 });

          for await (const result of csvFunction) {
              const params = {
                QueueUrl: queueUrl,
                MessageBody: JSON.stringify(result),
              };

            const response = await sqs.send(new SendMessageCommand(params))
            .catch(err=>console.log(err))
           }


          try{
            const copyInput={
               Bucket: bucket,
               CopySource: bucket + '/' + key,
               Key: key.replace('uploaded', 'parsed')
               }
           const copyResponse = await s3.send(new CopyObjectCommand(copyInput))
           .then(console.log('file copied to /parsed folder'))
           .then(await s3.send(new DeleteObjectCommand({Bucket:bucket,Key:key})))
           .then(console.log('File deleted from /upload folder'))}
          catch{
            err=>console.log(err)
           }

          }
