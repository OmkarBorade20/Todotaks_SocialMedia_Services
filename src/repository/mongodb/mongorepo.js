const Db=require('../../connections/mongodb/mongo')



module.exports.find=async function (collection)
{
   let Database= Db.getDb();
   let coll=Database.collection(collection)
   let data=await coll.find({}).toArray();
   return data;
}

module.exports.findQuery=async function (collection,query)
{
   let Database= Db.getDb();
   let coll=Database.collection(collection)
   let data=await coll.find(query).toArray();
   return data;
}

module.exports.insertMany=async function (collection,data)
{
   let Database= Db.getDb();
   let coll=Database.collection(collection)
   let insert_details=await coll.insertMany(data);
   return insert_details;
}

module.exports.insertOne=async function (collection,data)
{
   let Database= Db.getDb();
   let coll=Database.collection(collection)
   let insert_details=await coll.insertOne(data);
   return insert_details;
}

module.exports.updateOne=async function (collection,query,data)
{
   let Database= Db.getDb();
   let coll=Database.collection(collection)
   let insert_details=await coll.updateOne(query,data);
   return insert_details;
}

module.exports.deleteOne=async function (collection,query)
{
   let Database= Db.getDb();
   let coll=Database.collection(collection)
   let insert_details=await coll.deleteOne(query);
   return insert_details;
}

module.exports.deleteMany=async function (collection,query)
{
   let Database= Db.getDb();
   let coll=Database.collection(collection)
   let insert_details=await coll.deleteMany(query);
   return insert_details;
}