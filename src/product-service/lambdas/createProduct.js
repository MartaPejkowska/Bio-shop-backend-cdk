import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import {responses} from '../mock/responses.js';
import { v4 as uuidv4 } from 'uuid';
import * as Joi from 'joi';

const dynamo= DynamoDBDocument.from(new DynamoDB());
const TableName=process.env.TABLENAME
const StockTable=process.env.STOCKTABLENAME

const schema=Joi.object({
    title:Joi.string().min(3).required(),
    description:Joi.string().optional(),
    price:Joi.number().positive().required(),
    image:Joi.string(),
    packSize:Joi.string(),
    id:Joi.string().guid(),
    count:Joi.number().required()
})

export const handler= async event=>{

    console.log(event)

    const parsedEvent=event.body? JSON.parse(event.body): event
    const product={
        title:parsedEvent.title,
        description:parsedEvent.description || null,
        price:parsedEvent.price,
        image:parsedEvent.image || null,
        packSize:parsedEvent.packSize || null
    }
    console.log(product)
    let id=uuidv4();
    product.id=id

    const stock={
    product_id:id,
    count:parsedEvent.count
}

    const result = schema.validate(parsedEvent)
    const isValid=result.error

     if (isValid=== undefined || null) {
     const newProduct = await dynamo.put({TableName:TableName, Item:product})
    .catch(err=> console.log(err))
    .then(dynamo.put({TableName:StockTable, Item: stock}))
    .catch(err=> console.log(err))

    const succesMessage=['Product added to Product and Stock database  ', parsedEvent]
    console.log(succesMessage)
    return responses._200(succesMessage)
    }
    else
    {const failMessage='Invalid data   '+ result.error.details.map(detail =>  detail.message)
    console.log(failMessage)
    return responses._400(failMessage)
}

}