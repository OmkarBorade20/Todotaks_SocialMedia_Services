const mongorepo=require('../repository/mongodb/mongorepo')
const ObjectID = require('mongodb').ObjectId;
module.exports.post=async function (req)
{
  
    console.log("create a post for user")
    let email=req.user;

    let data={
        "email":email,
        "post":req.body.post,
        "created_on":new Date()

    }
    let saveResult=await mongorepo.insertOne("Posts",data)
    console.log(saveResult)

    req.res.message=saveResult.acknowledged?"Sucessfully added the post !!.":"Something WentWrong"
    return req;

}
module.exports.fetchAll=async function (req)
{
    let data=await mongorepo.findQuery("Posts",{})
    req.res.message=`${data.length} : Records Fethed !!!.`
    req.res.data=data;
    return req;

}
module.exports.fetch=async function (req)
{
    let email=req.user;
    let data=await mongorepo.findQuery("Posts",{"email":email})
    req.res.message=`${data.length} : Records Fethed !!!.`
    req.res.data=data;
    return req;

}
module.exports.updatePosts=async function (req)
{
    let email=req.user;

    //check if the post is of the same user orr not 
    let posts=await mongorepo.findQuery("Posts",{"_id":new ObjectID(req.body.id)})

    if(posts.length==0)
    {
        req.res.message=`The Post is Not Present,Please Enter a valid Id.`;
        return req;
    }
    //check if the post belong to the user.
    if(posts[0].email!=email)
    {
        req.res.message=`Only the User:${posts[0].email} can Edit this Post.`;
        return req;
    }

    //update the post.
    let data={"$set":{
        "post":req.body.post,
        "modified_at":new Date()
    }}

    let updte_post=await mongorepo.updateOne("Posts",{"_id":new ObjectID(req.body.id)},data)

    req.res.message=`${updte_post.modifiedCount}:Post Updated!.`;
    return req;

}

module.exports.deletePosts=async function (req)
{
    
    let email=req.user;
     //check if the post is of the same user orr not 
     let posts=await mongorepo.findQuery("Posts",{"_id":new ObjectID(req.body.id)})

     if(posts.length==0)
     {
         req.res.message=`The Post is Not Present,Please Enter a valid Id.`;
         return req;
     }
     //check if the post belong to the user.
     if(posts[0].email!=email)
     {
         req.res.message=`Only the User:${posts[0].email} can Delete this Post.`;
         return req;
     }

     let delete_status=await mongorepo.deleteOne("Posts",{"_id":new ObjectID(req.body.id)})

     req.res.message=`${delete_status.deletedCount}:Posts Deleted!.`
     return req;

}

module.exports.addComment=async function (req)
{
    let email=req.user;
    let posts=await mongorepo.findQuery("Posts",{"_id":new ObjectID(req.body.id)})

    if(posts.length==0)
    {
        req.res.message=`The Post is Not Present,Please Enter a valid Id.`;
        return req;
    }
    let newComment={
        "user":email,
        "comment":req.body.comment,
        "created_at":new Date()
    }
    let comments=posts[0].comments?posts[0].comments:[];
    comments.push(newComment)


    let updte_post=await mongorepo.updateOne("Posts",{"_id":new ObjectID(req.body.id)},{"$set":{"comments":comments}})

    req.res.message=`${updte_post.modifiedCount}:Comment Added Sucessfully!.`;
    return req;

}

module.exports.markComplete=async function (req)
{
    let email=req.user;
     //check if the post is of the same user orr not 
     let posts=await mongorepo.findQuery("Posts",{"_id":new ObjectID(req.body.id)})

     if(posts.length==0)
     {
         req.res.message=`The Post is Not Present,Please Enter a valid Id.`;
         return req;
     }
     //check if the post belong to the user.
     if(posts[0].email!=email)
     {
         req.res.message=`Only the User:${posts[0].email} can Mark this Post complete.`;
         return req;
     }
     let data={
        "$set":{"is_complete":1}
     }
     let updte_post=await mongorepo.updateOne("Posts",{"_id":new ObjectID(req.body.id)},data)

    req.res.message=`${updte_post.modifiedCount}:Task Completed Sucessfully!.`;
    return req;


}