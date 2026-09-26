const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("MONGO_URI loaded:", !!process.env.MONGO_URI);

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");
    } catch (error) {
        console.log("MongoDB connection failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;