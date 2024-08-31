import mongoose from "mongoose";
import "dotenv/config"

const connectDB = async () => {
    const {
        MONGODB_DATABASE,
        MONGODB_USER,
        MONGODB_PASSWORD,
        MONGODB_DOCKER_PORT,
    }= process.env
    const mongodb_url= `mongodb://youssef:test1234@mongodb:27017/mydb` 
    try {
        const mongodbUrl = process.env.mongodb;
        await mongoose.connect(mongodb_url);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("Connection error:", err);
        process.exit(1);
    }
};

export default connectDB;