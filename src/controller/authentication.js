const service=require('../service/authentication')

module.exports.login=async function (req,res,next)
{
    try{
        await service.login(req)
        next()
    }catch(e){
        next(e)
    }
}


module.exports.logout=async function (req,res,next)
{
    try{
        await service.logout(req)
        next()
    }catch(e){
        next(e)
    }
}
module.exports.signup=async function (req,res,next)
{
    try{
        await service.signup(req)
        next()
    }catch(e){
        next(e)
    }
}

module.exports.refreshToken=async function (req,res,next)
{
    try{
        await service.refreshToken(req,res)
        next()
    }catch(e){
        next(e)
    }
}

