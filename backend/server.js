import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from 'mongoose'

// load environment variables
dotenv.config()

// import routes
import authRoutes from "./routes/authRoutes.js";
import advisoryRoutes from "./routes/advisoryRoutes.js"
import marketRoutes from "./routes/marketRoutes.js"
import weatherRoutes from "./routes/weatherRoutes.js"

const app = express();

app.use(express.json());
app.use(cors());

// health check route

app.get('/', (req,res)=>{
    res.json({
        success: true,
        messasge: "Akilima server running",
    })
})


// API Routes

app.use('/api/auth', authRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/advisories', advisoryRoutes);
app.use('/api/market-prices', marketRoutes);

// connecting to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL,);
        console.log('Mongodb Connected successfuly');
    } catch (error) {
        // console.error(`Error: ${error.messasge}`);
        process.exit(1);
        
    }
}

// start server

const PORT = process.env.PORT || 5000;
connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server running on port : ${PORT}`);
    })
})