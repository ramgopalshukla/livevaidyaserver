const authmiddleware= require('../middlewares/authmiddlewares')
const express= require('express');
const {getAllUserController, getAlldoctorController, changeAccountstatuscontroller} = require('../controllers/adminCtrl');
const router= express.Router()



 // Get method || users

 router.get('/getAllUsers', authmiddleware, getAllUserController)

//  get method || doctors

router.get('/getAllDoctors', authmiddleware, getAlldoctorController)
router.post("/changeAccountStatus", authmiddleware, changeAccountstatuscontroller);

module.exports= router;