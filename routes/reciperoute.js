 const {getRecipe} = require('../controllers/recipeeCtrl')



 const express= require('express')

 const reciperouter= express.Router()


 reciperouter.get("/recipes",async(req,res)=>{

    try{
        let user = req.user;
        let query = req.query;

         

        let data = await getRecipe(user,query);

        
        res.send({
            data:data
        })
    }catch(err){
        res.status(404).send({
            err:err.message
        })
    }


})


 module.exports= reciperouter


