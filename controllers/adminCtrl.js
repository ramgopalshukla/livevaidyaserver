const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");

const getAllUserController = async (req, res) => {
  try {
    const users = await userModel.find({});

    res.status(200).send({
      success: true,
      message: "Users data List",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "not getting users",
    });
  }
};

const getAlldoctorController = async (req, res) => {
  try {
    const doctors = await doctorModel.find();
    res.status(200).send({
      success: true,
      message: "Doctors Data List",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "not getting doctors",
      error,
    });
  }
};

const changeAccountstatuscontroller = async (req, res) => {
  try {
    const { doctorId, status } = req.body;

    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });

    const user = await userModel.findOne({ _id: doctor.userId });

    const notification = user.notification;
    notification.push({
      type: "doctor-account-request-upadated",
      message: `Your Doctor Account request Has ${status}`,
      onClickPath: "/notification",
    });

    user.isDoctor = status==="approved" ? true : false;

    await user.save();

    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Account Status",
    });
  }
};

module.exports = {
  getAllUserController,
  getAlldoctorController,
  changeAccountstatuscontroller,
};
