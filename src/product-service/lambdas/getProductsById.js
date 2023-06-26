import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import {responses} from '../mock/responses'

const dynamo= DynamoDBDocument.from(new DynamoDB());

export const handler= async(event)=>{
    console.log(event)
    let id=event?.pathParameters.productId
    let product_id=id
    const productResult= await dynamo.get({
            TableName:process.env.TABLENAME,
            Key:{
                id
            }
        });
    const stockResult= await dynamo.get({
        TableName:process.env.STOCKTABLENAME,
        Key:{
            product_id
        }
    })
    const stock= stockResult.Item
    const product=productResult.Item
        if(!id || !event.pathParameters){
            return responses._400('There is no id')
        }
        else if(!product) {
        return  responses._400('There is no such product')
        }
        return responses._200(Object.assign(product,product.count=stock.count))
}