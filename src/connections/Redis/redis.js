const redis=require('redis')

let redisClient;

async function connect(){

    const client = redis.createClient({
        // socket: {
        //     host: 'redis-19050.c212.ap-south-1-1.ec2.cloud.redislabs.com',
        //     port: 19606,
        //   }, 
        //    password: 'uuNQDaI5v9jlDkzWCPB6tHrhXHNmWlxG'
        //   });
        url: 'redis://:uuNQDaI5v9jlDkzWCPB6tHrhXHNmWlxG@redis-19050.c212.ap-south-1-1.ec2.cloud.redislabs.com:19606'})


//           import { createClient } from 'redis';

// const client = createClient({
//     password: 'uuNQDaI5v9jlDkzWCPB6tHrhXHNmWlxG',
//     socket: {
//         host: 'redis-19050.c212.ap-south-1-1.ec2.cloud.redislabs.com',
//         port: 19050
//     }
// });

await client.connect()
client.on('connect',()=>{
    console.log('Client connected to Redis')
})
client.on('error',(err)=>{
    console.log(`Error While connecting Redis :${err}`)
})
redisClient=client;
return client;
}

function getClient()
{
    return redisClient;
}


// await client.set('key', 'value');
// const value = await client.get('key');
// await client.disconnect();

module.exports={connect,getClient}