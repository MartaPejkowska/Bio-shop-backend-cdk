import { SNSClient,PublishCommand } from "@aws-sdk/client-sns";
import * as dotenv from 'dotenv'


dotenv.config()

export const SNSService=async(message)=>{
const sns= new SNSClient()
const TOPIC_ARN=process.env.TOPIC_ARN

let count=message[1].length

  try{
      const response = await sns.send(new PublishCommand({
      Subject: 'Products added',
      Message: message.join(' '),
      TopicArn: TOPIC_ARN,
      MessageAttributes:{
        count:{
          DataType:'Number',
          StringValue:count
      }}
      }));
      }
  catch (err) {
    console.log("Error", err.stack)
  }
}
