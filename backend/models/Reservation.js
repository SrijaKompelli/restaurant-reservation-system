const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    table:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Table",
        required:true
    },

    date:{
        type:String,
        required:true
    },

    startTime:{
        type: Date,
        required:true
    },

    endTime:{
        type: Date,
        required:true
    },

    guests:{
        type:Number,
        required:true
    },

    status:{
        type:String,
        default:"confirmed"
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Reservation",reservationSchema);