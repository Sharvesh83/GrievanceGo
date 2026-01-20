const axios = require('axios');
const jwt = require('jsonwebtoken');

// Configuration
const API_URL = 'http://localhost:3000/api';
const JWT_SECRET = "supersecretkey_change_this_later"; // Matching server.js default
const TEST_USER = {
    id: 'test_user_123',
    name: 'Test Citizen',
    email: 'test@example.com',
    role: 'citizen'
};

// Generate Local Token (HS256) to bypass Auth0 RS256 check
const token = jwt.sign(TEST_USER, JWT_SECRET, { expiresIn: '1h' });

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
};

async function testBackendFeatures() {
    console.log("=== Starting Backend Feature Verification ===");
    console.log(`Target: ${API_URL}`);
    console.log(`User: ${TEST_USER.email}`);

    try {
        // 1. Test Grievance Submission (Triggers AI)
        console.log("\n[1] Testing Grievance Submission & AI Analysis...");
        const grievanceData = {
            name: TEST_USER.name,
            wardno: "10",
            phoneno: "1234567890",
            arealimit: "Zone A",
            subject: "Overflowing Garbage Bin",
            department: "Sanitation", // Intentionally wrong or generic to see if AI corrects it
            address: "123 Main St, Downtown",
            description: "The garbage bin at the corner of Main St has been overflowing for 3 days. It smells terrible and is attracting pests.",
            userId: TEST_USER.id,
            createdBy: TEST_USER.name
        };

        const createRes = await axios.post(`${API_URL}/addinfo`, grievanceData, { headers });

        if (createRes.status === 201) {
            console.log("✅ Grievance Submitted Successfully");
            console.log("AI Analysis Result:", JSON.stringify(createRes.data.aiAnalysis, null, 2));

            // Validation
            if (createRes.data.aiAnalysis && createRes.data.aiAnalysis.sentiment) {
                console.log("✅ AI Analysis field is present");
            } else {
                console.error("❌ AI Analysis Missing in response");
            }

            const grievanceId = createRes.data._id;

            // 2. Fetch User Grievances
            console.log("\n[2] Testing Fetch User Grievances...");
            const fetchRes = await axios.get(`${API_URL}/user-grievances`, { headers });
            const found = fetchRes.data.find(g => g._id === grievanceId);

            if (found) {
                console.log("✅ Created grievance found in user list");
            } else {
                console.error("❌ Created grievance NOT found in user list");
            }

            // 3. Test Add Chat
            console.log("\n[3] Testing Chat Addition...");
            const chatMsg = {
                id: grievanceId,
                chat: {
                    sender: "official",
                    message: "We are looking into this.",
                    timestamp: new Date().toISOString()
                }
            };
            const chatRes = await axios.post(`${API_URL}/addchat`, chatMsg, { headers });
            if (chatRes.status === 200 && chatRes.data.chats.length > 0) {
                console.log("✅ Chat added successfully");
            } else {
                console.error("❌ Chat addition failed");
            }

            // 4. Test Update Status
            console.log("\n[4] Testing Update Status...");
            const statusRes = await axios.patch(`${API_URL}/updatestatus`, { id: grievanceId }, { headers });
            if (statusRes.status === 200 && statusRes.data.status === "Resolved") {
                console.log("✅ Status updated to Resolved");
            } else {
                console.error("❌ Status update failed");
            }

        } else {
            console.error(`❌ Failed to submit grievance. Status: ${createRes.status}`);
        }

    } catch (error) {
        console.error("❌ Verification Failed with Error:");
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data:`, error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testBackendFeatures();
