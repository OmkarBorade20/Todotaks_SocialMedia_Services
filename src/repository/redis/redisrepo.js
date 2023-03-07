const redis=require('../../connections/redis/redis')
const {promisify}=require('util')

module.exports.set=async function (key,data,ttl)
{
   let client= redis.getClient();
   const SET_ASYNC=promisify(client.set).bind(client);
  return  SET_ASYNC(key,JSON.stringify(data),'EX',ttl)
  
}

module.exports.get=async function (key)
{
    let client= redis.getClient();
    await client.connect()
    const GET_ASYNC=promisify(client.get).bind(client);
    return GET_ASYNC(key)
   
   
}