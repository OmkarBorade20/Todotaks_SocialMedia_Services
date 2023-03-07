const jwt=require('jsonwebtoken')
const { ExplainVerbosity } = require('mongodb')
const mongorepo=require('../repository/mongodb/mongorepo')

module.exports.genarateAuthenticationToken=  function(userData)
{
    let accessToken= jwt.sign(userData,process.env.AUTHENTICATION_SECERTE_KEY,{expiresIn: '1H'})
    let refreshToken=  jwt.sign(userData,process.env.REFRESH_TOKEN,{expiresIn: '1Y'})
   
    return {
        "accessToken":accessToken,
        "refreshToken":refreshToken
    }
    
}

module.exports.refreshToken=  function(refreshToken,req,res)
{
    let tokendata;
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN,async(error,data)=>{
        if(error)    
        {
            res.status(401);
            res.send({"message":(error.message=='jwt expired')?"Token Expired.":"Error in Login !!"})
        } 
        else{
            tokendata=this.genarateAuthenticationToken({"email":data.email,"password":data.password})
               //save the new refresh token in db or caching .
              // let save_refresh=await mongorepo.insertOne("users_session",{"user":data.email,"refresh_token":tokendata.refreshToken,created_at:new Date()})
        }

    
    })
    return tokendata;
}
   

module.exports.authenticatenToken=  function(req,res,next)
{
    let authHeader=req.body['authorization']
    let token=authHeader && authHeader.split(' ')[1];
    jwt.verify(token,process.env.AUTHENTICATION_SECERTE_KEY,async(error,user)=>{
        if(error)    
        {
            res.status(401);
            res.send({"message":(error.message=='jwt expired')?"Token Expired.":"Error in Login !!"})
        } 
        else{
            //check if user is logged in or not.
            let isloggedin=await checkIfUserIsLoggedIn(user.email)
            if(!isloggedin)
            {
                res.status(401);
                res.send({"message":`${user.email} is Not Logged in.`})
            }
            else{
                req.user=user.email;
                next();
                }
         
        }
       
    })
}

async function checkIfUserIsLoggedIn(email)
{
    let data=await mongorepo.findQuery("users_session",{
        "user":email
    })
    return data.length!=0?true:false;
}