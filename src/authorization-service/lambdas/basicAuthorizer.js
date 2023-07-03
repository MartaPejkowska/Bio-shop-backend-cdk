export const handler=async (event)=>{
    console.log('event',event)

    var token = event.headers.authorization_token;
    console.log('token',token)


    if (!token || token===undefined) {
        return {
          headers:{
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': ['Authorization', 'Content-Type']
          },
          statusCode:401,
          body:JSON.stringify('Unauthorized'),
        }
      }

      try {
        const encoded = token.split(" ")[1];
        const decoded = Buffer.from(encoded, "base64").toString();
        const username=process.env.USER_NAME
        const password=process.env.PASSWORD

        const response = {
          isAuthorized: `${username}:${password}`===decoded
        };
        console.log(response)


        let effect = 'Deny'

        if(response){
          effect = 'Allow'
        }
        else{
          effect = 'Deny'
        }

        let policy = {
      "principalId": "user",
      "policyDocument": {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Action": "execute-api:Invoke",
            "Effect": effect,
            "Resource": event.methodArn
          }
        ]
      }
    }
    return policy


      } catch (error) {
        console.log("Authorizer error", error);
        return {
          headers:{
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': ['Authorization', 'Content-Type']
          },
          statusCode:403,
          body:JSON.stringify('Access denied')

      }

};

}