console.log("Test Node Execution");
try {
    require('dotenv').config();
    console.log("Dotenv loaded");
    console.log("MONGO_URI length:", process.env.MONGO_URI ? process.env.MONGO_URI.length : "undefined");
} catch (e) {
    console.log("Error loading dotenv:", e.message);
}
