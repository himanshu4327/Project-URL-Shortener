const express=require('express');
const router=express.Router();
const urlController=require('../controller/urlController')



//.......................url Apis.....................................//
router.post('/url/shorten',urlController.createShortUrl)
// router.get('/urlCode', urlController.getUrl)




//......................invalid params....................................//
router.all('*',function (req,res){res.status(400).send({msg:"this page does not exist"})})

module.exports=router