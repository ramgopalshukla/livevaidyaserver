 const { logiController,registrationController , authctrl, applyDoctorController, getAllnotificationController, deleteAllController, getAllDoctorController, bookAppointmentController, bookingAvailibilityController, userAppointmentController} = require("../controllers/userCtrl");
  const authmiddleware= require('../middlewares/authmiddlewares');

 const express= require('express');

 const router= express.Router();


 router.post('/login', logiController);
 router.post('/register', registrationController);
 router.post('/getUserData', authmiddleware, authctrl);

 router.post("/apply-doctor", authmiddleware, applyDoctorController);

router.post("/get-all-notification", authmiddleware, getAllnotificationController);
router.post("/delete-all-notification", authmiddleware, deleteAllController);
router.get("/getAllDoctors", authmiddleware, getAllDoctorController);

router.post('/book-appointment', authmiddleware, bookAppointmentController)

// booking availability

router.post('/booking-availibility', authmiddleware, bookingAvailibilityController)


// appoointment list

router.get('/user-appointments', authmiddleware, userAppointmentController)
// post account statys
 module.exports= router;



