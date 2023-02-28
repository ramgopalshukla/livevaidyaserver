

const mongoose= require('mongoose');


const appointmentScema= mongoose.Schema({
    userId:{
        type: String,
        required: true
    }
    ,

    doctorId: {
        type: String,
        required: true
    },

    doctorInfo: {
        type: String,
        required:true,
    },

    userInfo: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },
    status:{
        type: String,
        required:true
    },
    time: {
        type: String,
        required: true
    }
}, {timeStamps: true})

const appointmodel= mongoose.model("appoinments", appointmentScema)

module.exports= appointmodel