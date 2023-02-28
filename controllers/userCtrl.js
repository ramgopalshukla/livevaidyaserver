const userModel = require("../models/userModel");

const jwt = require("jsonwebtoken");

const doctorModel = require("../models/doctorModel");
const appointmentmodel = require("../models/appointmentmodel");

const bcrypt = require("bcryptjs");
const moment= require('moment')
// login handler

const logiController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(200)
        .send({ message: "usre not found", success: false });
    }

    const ismatch = await bcrypt.compare(req.body.password, user.password);

    if (!ismatch) {
      return res
        .status(200)
        .send({ message: "invalid  email or password", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({ message: "login success", success: true, token });
  } catch (error) {
  
   
    res.status(500)
      .send({ message: `error in logic controll ${error.message}` });
  }
};

//  register handler
const registrationController = async (req, res) => {
  try {
    const existinguser = await userModel.findOne({ email: req.body.email });

    if (existinguser) {
      return res
        .status(200)
        .send({ message: "user alrewady Exist", success: false });
    }

    const password = await req.body.password;
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;

    const newuser = new userModel(req.body);
    await newuser.save();
    res.status(201).send({ message: "registration succesfull", success: true });
  } catch (err) {
   
    res
      .status(500)
      .send({ success: false, message: `Register Controller ${err.message}`, err });
  }
};

const authctrl = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.staus(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {


    res.status(500).send({
      success: false,
      message: `something went wrong  ${error.message}`,
      error,
    });
  }
};

const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });

    await newDoctor.save();

    const adminUser = await userModel.findOne({ isAdmin: true });

    const notification = adminUser.notification;

    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstname} ${newDoctor.lastname} Has Applied For A Doctor Account`,

      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onclickPath: "/admin/doctors",
      },
    });

    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied SAuccesfully",
    });
  } catch (error) {
  

    res.status(500).send({
      success: false,
      error,
      message: `something went wrong ${error.message}`,
    });
  }
};

const getAllnotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read ",
      data: updatedUser,
    });
  } catch (error) {
    
    res.status(500).send({
      success: false,
      error,
      message: `something went wrong ${error.message}`,
    });
  }
};

const deleteAllController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    user.notification = [];

    user.seennotification = [];

    const updateduser = await user.save();

    updateduser.password = undefined;

    res.status(200).send({
      success: true,
      message: "Notification Delete successsfully",
      data: updateduser,
    });
  } catch (error) {
  
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};

// getAllDoctorController

const getAllDoctorController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});

    res.status(200).send({
      success: true,
      message: "Doctors Lists Fetched Success",
      data: doctors,
    });
  } catch (error) {
  
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fething Doctor",
    });
  }
};

const bookAppointmentController = async (req, res) => {
  try {

    req.body.date= moment(req.body.date, 'DD-MM-YYYY').toISOString()
    req.body.time= moment(req.body.time, "HH:mm").toISOString();

    req.body.status = "pending";
    const newAppointment = new appointmentmodel(req.body);

    await newAppointment.save();

    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });

    user.notification.push({
      type: "New-appointment-request",
      message: `A new Apppointment Request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });

    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment Book successfully"
    })
  } catch (error) {
  
    res.status(500).send({
      success: false,
      error,
      message: "Error While booking appointment",
    });
  }
};


const bookingAvailibilityController= async (req, res)=>{

   try{


    const date= moment(req.body.date, "DD-MM-YY").toISOString();
    const fromTime= moment(req.body.time, "HH:mm")
    .subtract(1, "Hours")
    .toISOString();

    const totime= moment(req.body.time, "HH:mm").add(1, "hours").toISOString();

    const doctorId= req.body.doctorId;

    const appointments= await appointmentmodel.find({
      doctorId,
      date, time:{
        $gte: fromTime,
        $lte: totime
      }
    });

    if(appointments.lenght>0){
      return res.status(200).send({
        message: "Appointment not available at this time",
        success: true,
      })
    }else{
      return res.status(200).send({
        success: true,
        message: "Appointments available"
      });
    }
   }
   catch(error){
  
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking"
    })
   }

}

const userAppointmentController=async (req, res)=>{

  try{
   
    const appointments= await appointmentmodel.find({userId: req.body.userId})
    res.status(200).send({
      success:true,
      message:'user appoinments fetch succesfully',
      data: appointments
    })


  } catch(error){
  error,

  res.status(500).send({
    success:false,
    error,
    message: 'Error In User Appointment'
  })
  }

}

module.exports = {
  logiController,
  registrationController,
  authctrl,
  applyDoctorController,
  getAllnotificationController,
  deleteAllController,
  getAllDoctorController,
  bookAppointmentController,
  bookingAvailibilityController,
  userAppointmentController
};
