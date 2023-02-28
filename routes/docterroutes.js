
const express= require('express')
const {getDoctorController, updateProfileController, getDoctorByIdController, doctorAppointmentController, updateStatusController} = require('../controllers/doctorcontroller');
const authenticate = require('../middlewares/authmiddlewares');
const router= express.Router()

router.post('/getDoctorInfo', authenticate, getDoctorController )
router.post('/updateProfile', authenticate, updateProfileController )

// GET SINGLEDOC INFO

router.post('/getDoctorById', authenticate, getDoctorByIdController)

router.get("/doctor-appointments", authenticate, doctorAppointmentController)

//  POST Update Status


router.post('/update-status', authenticate, updateStatusController)

module.exports= router;