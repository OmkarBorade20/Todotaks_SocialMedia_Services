const express=require('express')
const router=express.Router()
const controller=require('../controller/users')
const auth=require('../Authhentication/auth')

router.get('/fetchAll',controller.fetchAll)
router.post('/post',auth.authenticatenToken,controller.post)
router.post('/fetch',auth.authenticatenToken,controller.fetch)
router.post('/updatePosts',auth.authenticatenToken,controller.updatePosts)
router.post('/deletePosts',auth.authenticatenToken,controller.deletePosts)
router.post('/addComment',auth.authenticatenToken,controller.addComment)
router.post('/markComplete',auth.authenticatenToken,controller.markComplete)



module.exports=router;