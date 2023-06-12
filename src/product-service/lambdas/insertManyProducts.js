import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import {responses} from '../mock/responses'
import { v4 as uuidv4 } from 'uuid'
import {products} from '../mock/productList'

const dynamo= DynamoDBDocument.from(new DynamoDB(),{marshallOptions:{ removeUndefinedValues: true}});
const TableName=process.env.TABLENAME
const StockTable=process.env.STOCKTABLENAME

export const handler= async event=>{

    const notAdded=[]
    const added=[]

    for (i=0;i<products.length;i++){
        let productsScan= await dynamo.scan({
            TableName:TableName,
        })

        let productsInDb=productsScan.Items
        let id=uuidv4();
        products[i].id=id

        let item={
            id:products[i].id,
            title:products[i].title,
            description:products[i].description,
            price:products[i].price,
            image:products[i].image,
            packSize:products[i].packSize
        }
        console.log(item)
        let stock={
            product_id:id,
            count:Math.floor(Math.random()*100)
        }


      if(Array.prototype.some.call(productsInDb,(product)=>product.title===item.title)){
        console.log('This product is already in DB')
        notAdded.push(item.title)
         }

      else {
        const inserted = await dynamo.put({TableName:TableName,Item:item})
        .then(dynamo.put({TableName:StockTable, Item: stock}))
        .then(()=>{return responses._200('Data succesfully added to DB')})
        .then(()=>added.push(item))
        .catch(err=>{
            console.log(err)
            return(err, `Failed to insert data to DB`)
        })
        if(!inserted) return responses._400(`Failed to insert data to databases ${TableName} and ${StockTable}`)

      }
      if(i==(products.length-1)){
        return responses._200(`${notAdded.length} products was already in DB, ${added.length} products succesfully added into DB`)
      }
    }

}











