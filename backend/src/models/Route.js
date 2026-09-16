const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema({
    routeNo: {
        type : String,
        required: true,
    },

    stops:{
        type : [String],
        required: true
    }
});

module.exports= mongoose.model("Route",routeSchema)