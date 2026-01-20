require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Grievance, User } = require("./Models/model");
const connectDB = require("./DB/DB");

const seed = async () => {
    await connectDB();

    console.log("Cleaning up old test data...");
    await User.deleteMany({ email: "sharvesh@gmail.com" });
    // Optional: Delete old grievances for this user if we could identify them easily, 
    // but better to just add new ones for now or identifying by a seed flag. 
    // For simplicity, I'll just create the user and fresh grievances.

    console.log("Creating user sharvesh@gmail.com...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const user = await User.create({
        name: "Sharvesh",
        email: "sharvesh@gmail.com",
        password: hashedPassword,
        role: "citizen",
        phone: "9876543210"
    });

    console.log(`User created: ${user._id}`);

    console.log("Creating sample grievances...");
    const grievances = [
        {
            name: "Sharvesh",
            wardno: "12",
            phoneno: "9876543210",
            subject: "Street Light Malfunction",
            department: "Electrical",
            address: "123 Main St, Tech Park",
            description: "The street light in front of my house has been flickering for a week.",
            userId: user._id.toString(),
            createdBy: "Sharvesh",
            status: "In progress",
            createdOn: new Date()
        },
        {
            name: "Sharvesh",
            wardno: "12",
            phoneno: "9876543210",
            subject: "Garbage Collection Delayed",
            department: "Sanitation",
            address: "123 Main St, Tech Park",
            description: "Garbage truck hasn't visited for 3 days.",
            userId: user._id.toString(),
            createdBy: "Sharvesh",
            status: "Pending",
            createdOn: new Date(Date.now() - 86400000) // Yesterday
        },
        {
            name: "Sharvesh",
            wardno: "12",
            phoneno: "9876543210",
            subject: "Pothole on 4th Avenue",
            department: "Roads",
            address: "4th Avenue Junction",
            description: "Deep pothole causing traffic slowdowns.",
            userId: user._id.toString(),
            createdBy: "Sharvesh",
            status: "Resolved",
            createdOn: new Date(Date.now() - 172800000), // 2 days ago
            resolvedOn: new Date()
        }
    ];

    await Grievance.insertMany(grievances);
    console.log("Sample grievances added!");

    process.exit();
};

seed();
