import dns from "dns";
// Force Node to use Google DNS to bypass local ISP/Router SRV query blocking
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log('Connected to MongoDB'))
    .catch((error) => console.log("MongoDB connection error:", error));

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
})