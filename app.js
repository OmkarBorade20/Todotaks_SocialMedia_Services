const express=require('express')
const cors=require('cors')
const cluster=require('cluster')
const os=require('os')
const responseTime=require('response-time')
const bodyParser = require('body-parser')
const limitter=require('express-rate-limit')

const router=require('./src/router/index')
const mongo=require('./src/connections/mongodb/mongo')
const redis=require('./src/connections/redis/redis')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/swagger/swagger.json');


//initalize our app.
const app=express()

let numCPUS=os.cpus().length;

//only for development purpose.
// require('dotenv').config()


//mongoDb connection at app startup
mongo.connect((err)=>{
    if(err)
        console.log(`Mongo Error :${err}`)
 })

 //redis Connection at app startup 
 //have commented redis connection as facing some issue while connecting it with cloud redis server.
//  redis.connect((err)=>{
//     if(err)
//      console.log(`Redis CLient Error :${err}`)
//  })

 //handaling cors from server side and also .
 app.use(cors())
 app.use(bodyParser.urlencoded({ extended: false }))
 app.use(bodyParser.json({limit: '50mb'}))
 app.use(responseTime())


 //rate limiting all apis 
 app.use(limitter(
    {
        windowMs:5000,
        max:5,
        message:{
            "code":429,
            "message":"Maximum 5 Request allowed in 5 Seconds."
        }
    }
 ))

 //swagger api documentation integrations.
 swaggerDocument.servers[0].url= process.env.swaggerurl || swaggerDocument.servers[0].url;
 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
 app.use(router)

 const PORT=process.env.port ||3000;
 let server;
 //use cluster mode for scaling our App.
 if(cluster.isMaster && JSON.parse(process.env.CLUSTERMODE))       
 {  
    for(let i=0;i<numCPUS;i++)
    {
        cluster.fork()
    }
    cluster.on('exit',(worker,code,signal)=>{
        console.log(`Worker ${worker.process.pid} died.`)
        cluster.fork()
    })
 }
 else 
 {//slave process will only listen to the port.
     server=app.listen(PORT,()=>{
        console.log(`Listening to Port :${PORT} and Process :${process.pid}`)
    })
 }


//  server=app.listen(PORT,()=>{
//     console.log(`Listening to Port :${PORT}`)
// })

//for any unhandeld exception just logging it to console for now.
process.on('uncaughtException',  (err)=> {
    console.log(`uncaughtException :${err}`);
  })

  //gracefully shuting down the server if any signal is recived.
  process.on('SIGTERM', ()=> {
    console.log("SIGTERM Signal Recived");
    server.close(()=>{
        console.log("Server is Closing...")
        process.exit(0)
    })
  })

 process.on('SIGINT', ()=> {
    console.log("SIGTERM Signal Recived");
    server.close(()=>{
        console.log("Server is Closing...")
        process.exit(0)
    })
  })

