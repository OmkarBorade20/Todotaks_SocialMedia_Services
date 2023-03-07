const express=require('express')
const router=express.Router()
const RespHandler=require('../utility/resHandler')
const errorHandler=require('../utility/errorHandler')



router.use('/',require('./authentication'))
router.use('/users',require('./users'))



router.use(RespHandler)
router.use(errorHandler)
module.exports=router;