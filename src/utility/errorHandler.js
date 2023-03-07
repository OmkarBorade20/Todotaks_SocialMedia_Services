const errHandler=(err,req,res,next)=>{
    let statusCode=200;
    let response={}
    if(err)
    {
        console.log(err)
        response={
            "message":"Error Caused.",
            "data":JSON.stringify(err.message)
                } 
        res.status(500)
        res.send(response);
     }
    }
   
module.exports=errHandler;