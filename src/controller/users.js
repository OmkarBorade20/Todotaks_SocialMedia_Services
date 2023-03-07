const service=require('../service/users')

module.exports.fetchAll=async function (req,res,next)
{
    try{
        await service.fetchAll(req)
        next()
    }catch(e){
        next(e)
    }
}


module.exports.post=async function (req,res,next)
{
    try{
        await service.post(req)
        next()
    }catch(e){
        next(e)
    }
}
module.exports.fetch=async function (req,res,next)
{
    try{
        await service.fetch(req)
        next()
    }catch(e){
        next(e)
    }
}

module.exports.updatePosts=async function (req,res,next)
{
    try{
        await service.updatePosts(req,res)
        next()
    }catch(e){
        next(e)
    }
}

module.exports.deletePosts=async function (req,res,next)
{
    try{
        await service.deletePosts(req,res)
        next()
    }catch(e){
        next(e)
    }
}

module.exports.addComment=async function (req,res,next)
{
    try{
        await service.addComment(req,res)
        next()
    }catch(e){
        next(e)
    }
}

module.exports.markComplete=async function (req,res,next)
{
    try{
        await service.markComplete(req,res)
        next()
    }catch(e){
        next(e)
    }
}
