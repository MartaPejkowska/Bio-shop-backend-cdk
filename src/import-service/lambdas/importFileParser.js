import csv from 'csv-parser'
import { S3Client, GetObjectCommand, CopyObjectCommand,DeleteObjectCommand} from "@aws-sdk/client-s3";
const results = [];


export const handler= async (event)=>{

    const s3= new S3Client();

    const bucket=event.Records[0].s3.bucket.name
    const key=event.Records[0].s3.object.key

    //Getting Object

    const response =  await s3.send(new GetObjectCommand({Bucket:bucket,Key:key}))
    //console every record and after finish move file to parsed folder

    response.Body.pipe(csv()).on("data", async(data) => {
            console.log(data)
            results.push(data);
            }).on("end", async () => {
                return results
            })

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


