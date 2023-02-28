const appointmodel = require("../models/appointmentmodel");
const doctorModel = require("../models/doctorModel");
const userModel = require('../models/userModel')

const getDoctorController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fething Doctor Details",
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      {
        userId: req.body.userId,
      },
      req.body
    );

    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
  
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update issue",
      error,
    });
  }
};

const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id:req.body.doctorId });

    res.status(200).send({
      success: true,
      message: "git single doctor",
      data: doctor,
    });
  } catch (error) {
    error,
      res.status(500).send({
        success: false,
        message: "not getting single docto information",
        error,
      });
  }
};

const doctorAppointmentController= async (req, res)=>{
        

  try{

    const doctor= await doctorModel.findOne({userId: req.body.userId})

    const appointments= await appointmodel.find({doctorId: doctor._id})
 

    res.status(200).send({
      success: true,
      message: "Doctor Appointment fetch Succesfully",
      data: appointments
    })
    

  }

  catch(error){
    error, 
    res.status(500).send({
      success: false,
 
      message:"not gettting appointments in doctor appointment page",
    
    });

  }



}

const updateStatusController= async (req, res)=>{

     try{

   const {appointmentsId, status}= req.body


   const appointment= await appointmodel.findByIdAndUpdate(appointmentsId, {status})


   const user= await userModel.findOne({_id: appointment.userId})
    const notification= user.notification;
    notification.push({
    type: "Status updated",
    message:`Your appointment has been updated ${status}`,
    onClickPath: "/doctor-appointments",
   });

   await user.save();
  res.status(200).send({
    success: true,
    message:"Appointment Status Updated",
  })





     } catch(error){
   
      res.status(500).send({
        success: false,
        error,

        message: "not updating status", 
  
      })
     }
}

module.exports = {
  getDoctorController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentController,
  updateStatusController
};
