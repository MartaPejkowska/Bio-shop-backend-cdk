import {products} from './productList.js';
import { responses } from './responses.js';


export const handler = async (event) => {
    const {productId}  = event?.pathParameters;
  console.log(productId)
  const result = await products.find(product => product.productId === productId);

  if(!result){
    return responses._400({message:'Product not found'})

  }
   return responses._200(result)
}