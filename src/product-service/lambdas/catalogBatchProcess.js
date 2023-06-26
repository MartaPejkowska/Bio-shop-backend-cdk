const {Lambda} = require("@aws-sdk/client-lambda")
import {SNSService} from './SNSService.js'

export const handler=async (event)=>{

try{
  const added=[]
  console.log(event)
  const products=event.Records.map((record) => JSON.parse(record.body))

  for (const product of products){

    try{

      const newProduct= await new Lambda().invoke({
                  FunctionName: 'createProduct',
                  Payload: JSON.stringify(product),
                  InvocationType: 'Event'
                }).promise()
       }

    catch {err=>console.log(err)}

    added.push(product.title)
  }

  const message=[`Added ${added.length} products:`, added]
  console.log(message)
  await SNSService(message)

}
catch{
err=>console.log(err)
}

}










