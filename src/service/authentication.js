const mongorepo=require('../repository/mongodb/mongorepo')
const crypt=require('../utility/cryptPasswords')
const jwtAuthentication=require('../Authhentication/auth')


module.exports.login=async function (req)
{
    //logic for login.
    console.log("login")
    let fetch_userdata=await mongorepo.findQuery("Users_Details",{"email":req.body.email})
    if(fetch_userdata.length==0)
        return req.res.message=`Please Signup First.`;
    //check if login credentials are correct.
    let isEmailValid=req.body.email===fetch_userdata[0].email?true:false;
    let isPasswordValid=await crypt.validatePassword(req.body.password,fetch_userdata[0].password)
    //generate a token and send ro users.
    if(isEmailValid && isPasswordValid )
    {
        //check if user is already logged in or not.
        let fetch_refreshToken=await mongorepo.findQuery("users_session",{"user":req.body.email})
        if(fetch_refreshToken.length!=0)
        {
            req.res.message=`You Are Already logged in.`;
            req.res.data={"accessToken":fetch_refreshToken[0].acessToken,"refreshToken":fetch_refreshToken[0].refreshToken}
            return req;
        }
        let data={"email":req.body.email,"password":req.body.password}
       let token=await jwtAuthentication.genarateAuthenticationToken(data)
       console.log(token)
      // let result=await redis.set('Tokens',token,11)
       let save_refresh=await mongorepo.insertOne("users_session",{"user":req.body.email,"accessToken":token.accessToken,"refreshToken":token.refreshToken,created_at:new Date()})
       console.log(save_refresh) 
       req.res.message=`Login Success Full.`;
     
        req.res.data={"accessToken":token.accessToken,"refreshToken":token.refreshToken}
    }
    else
        req.res.message=`Login Failed !!`;
    

    return req;
     
}


module.exports.logout=async function(req)
{

    console.log("logout")
    let email=req.user;
    let fetch_refreshToken=await mongorepo.findQuery("users_session",{"user":email})
    if(fetch_refreshToken.length==0)
    {
        req.res.message=`You Are Not Logged IN`
        return req;
    }
    
    let staus= await mongorepo.deleteOne("users_session",{"user":email})
    if(staus.deletedCount!=0)
    {
        req.res.message=`${email}:loggedOut Sucessfully!.`
        return req;
    }
}

module.exports.refreshToken=async function (req,res)
{
    let authHeader=req.body['authorization']
    let refreshtoken=authHeader && authHeader.split(' ')[1];

   //check if refresh token is present in db or redis.
    let prev_refreshToken=await mongorepo.findQuery("users_session",{
        "refreshToken":authHeader.split(' ')[1]
    })
    prev_refreshToken=prev_refreshToken.map(e=>e.refreshToken)
    if(prev_refreshToken.length!=0)
    {
        console.log("refreshtoken is valid")
        let newTokens= jwtAuthentication.refreshToken(refreshtoken,req,res)

        //also update the old acess token from users session db
        let data={
            "$set":{
                "acessToken":newTokens.accessToken,
                "refreshToken":newTokens.refreshToken,
                "modified_at":new Date()
            }
        }
        await mongorepo.updateOne("users_session",{
            "refreshToken":authHeader.split(' ')[1]
        },data)

        req.res.message="New Tokens Generated"
        req.res.data=newTokens;
        return req;
    }
    else{
        req.res.message="Refresh Token Enterd is Wrong !!"
        return req;
    }
  
}


module.exports.signup=async function (req)
{

    //buiz logic for signup
   let encryptedPassword=await crypt.encryptPassword(req.body.password)
   let collection="Users_Details"
   let data={
    "userName":req.body.userName,
    "password":encryptedPassword,
    "email":req.body.email,
   }
    //check if email is already registerd with us or not.
    let existingUser=await mongorepo.findQuery(collection,{"email":data.email});
   if(existingUser.length!=0)
   {    
        req.res.message=`${data.email} Email is Already Registerd with us.`
   }
   //save User in db.
   let insert_details=await mongorepo.insertOne(collection,data);

    //genrate tokens.
    let Tokens=jwtAuthentication.genarateAuthenticationToken({"email":data.email,"password":data.password})
    //cahe the tokens.
    console.log(Tokens)
    if(insert_details.acknowledged)
   {
    //storing the accessToken and Refresh Token in DB.
   await mongorepo.insertOne("users_session",{
    "user":data.email,
    "acessToken":Tokens.accessToken,
    "refreshToken":Tokens.refreshToken
   });
    req.res.message=`Welcome ${data.email}.`
    req.res.data=[{"acessToken":Tokens.accessToken,"refreshToken":Tokens.refreshToken}]
   }
     
    return req;
 
}


