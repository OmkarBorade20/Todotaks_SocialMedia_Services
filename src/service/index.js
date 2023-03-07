const mongorepo=require('../repository/mongodb/mongorepo')


module.exports.hello=async function (req)
{
    req.res.message=`Hellooo ${req.user.email}` 
    return req;
}


module.exports.findByQuery=async function (req)
{
    let input=req.body;
    let data=await mongorepo.findQuery(input.collection,input.query)
    req.res.message=`Data Fetched!!`
    req.res.data=data;
    return req;
}


module.exports.InsertMany=async function (req)
{
    let input=req.body;
    let data=await mongorepo.insertMany(input.collection,input.data)

    req.res.message=`Sucess`
    req.res.data=data;
    return req;
}

module.exports.InsertOne=async function (req)
{
    let input=req.body;
    let data=await mongorepo.insertOne(input.collection,input.data)
    req.res.message=`sucess`
    req.res.data=data;
    return req;
}
