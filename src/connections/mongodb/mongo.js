const { MongoClient } = require('mongodb');


// Connection URL
const url = process.env.dburl || 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName =  process.env.dbname ||'MyApp';

let Db;
async function connect() {
  // Use connect method to connect to the server
 let con=await client.connect();
 Db=con.db(dbName)

 console.log(`connected to Db:${Db.databaseName}.`)
  return Db;
}
// client.db().collection('collection')
function getDb()
{
  return Db;
}

module.exports={connect,getDb}