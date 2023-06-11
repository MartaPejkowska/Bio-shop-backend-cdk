import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { responses } from "../mock/responses";


const dynamo= DynamoDBDocument.from(new DynamoDB());



export const handler= async(event)=>{
    console.log(event)
    const productsScan= await dynamo.scan({
            TableName:process.env.TABLENAME
        })
    const stocksScan= await dynamo.scan({
            TableName:process.env.STOCKTABLENAME
    })
    const products=productsScan.Items
    const stocks=stocksScan.Items

    products.map((product) => {stocks.map(stock=>{
    if(product.id===stock.product_id)
     {Object.assign(product,product.count=stock.count)
    }
})})

    if(products.length==0){
        return  responses._500(`There are no data in DB`)
    }
    else if(!productsScan) {
        return  responses._500(`There was an error fetching data from DB}`)
        }
    return responses._200(products)
}