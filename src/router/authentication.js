const router=require('express').Router();
const userController=require('../controller/authentication')
const limitter=require('express-rate-limit')
const auth=require('../Authhentication/auth')

const loginLimitter=limitter({
    windowMs:1*60*1000,
    max:5,
    message:{
        "code":429,
        "message":"Maximum 5 Request allowed in 1 minute."
    }
})

router.post('/signup',userController.signup)
router.post('/login',loginLimitter,userController.login)

router.post('/logout',auth.authenticatenToken,userController.logout)
router.post('/refreshToken',userController.refreshToken)
module.exports=router;